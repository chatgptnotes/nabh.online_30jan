import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chapter, ObjectiveElement, Status, ElementCategory, ChapterType } from '../types/nabh';
import { loadAllObjectiveEditsFromSupabase, loadChaptersFromSupabase, loadAllNormalizedData } from '../services/objectiveStorage';

// Helper function for chapter type (can be removed if not needed)
// Note: Chapter types could also be stored in nabh_chapters table if needed

const getChapterType = (code: string): string => {
  const types: Record<string, string> = {
    'AAC': 'Clinical',
    'COP': 'Clinical',
    'MOM': 'Clinical',
    'PRE': 'Administrative',
    'HIC': 'Clinical',
    'PSQ': 'Quality',
    'ROM': 'Administrative',
    'FMS': 'Infrastructure',
    'HRM': 'Administrative',
    'IMS': 'Technology',
  };
  return types[code] || 'Clinical';
};

interface NABHStore {
  chapters: Chapter[];
  selectedChapter: string | null;
  selectedObjective: string | null;
  searchQuery: string;
  filterStatus: Status | 'all';
  filterPriority: string;
  filterCategory: ElementCategory | 'all';
  showCoreOnly: boolean;
  isLoadingFromSupabase: boolean;

  setSelectedChapter: (chapterId: string | null) => void;
  setSelectedObjective: (objectiveId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: Status | 'all') => void;
  setFilterPriority: (priority: string) => void;
  setFilterCategory: (category: ElementCategory | 'all') => void;
  setShowCoreOnly: (show: boolean) => void;
  updateObjective: (chapterId: string, objectiveId: string, updates: Partial<ObjectiveElement>) => void;
  getFilteredObjectives: (chapterId: string) => ObjectiveElement[];
  loadDataFromSupabase: () => Promise<void>;
  loadFromNormalizedSchema: () => Promise<void>;
  loadDataFromLegacy: () => Promise<void>;
}

export const useNABHStore = create<NABHStore>()(
  persist(
    (set, get) => ({
      chapters: [],
      selectedChapter: null,
      selectedObjective: null,
      searchQuery: '',
      filterStatus: 'all',
      filterPriority: 'all',
      filterCategory: 'all',
      showCoreOnly: false,
      isLoadingFromSupabase: false,

      setSelectedChapter: (chapterId) => set({ selectedChapter: chapterId, selectedObjective: null }),
      setSelectedObjective: (objectiveId) => set({ selectedObjective: objectiveId }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFilterStatus: (status) => set({ filterStatus: status }),
      setFilterPriority: (priority) => set({ filterPriority: priority }),
      setFilterCategory: (category) => set({ filterCategory: category }),
      setShowCoreOnly: (show) => set({ showCoreOnly: show }),

      updateObjective: (chapterId, objectiveId, updates) =>
        set((state) => ({
          chapters: state.chapters.map((chapter) =>
            chapter.id === chapterId
              ? {
                  ...chapter,
                  objectives: chapter.objectives.map((obj) =>
                    obj.id === objectiveId ? { ...obj, ...updates } : obj
                  ),
                }
              : chapter
          ),
        })),

      getFilteredObjectives: (chapterId) => {
        const state = get();
        const chapter = state.chapters.find((c) => c.id === chapterId);
        if (!chapter) return [];

        return chapter.objectives.filter((obj) => {
          const matchesSearch =
            state.searchQuery === '' ||
            obj.code.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            obj.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            obj.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            obj.evidencesList.toLowerCase().includes(state.searchQuery.toLowerCase());

          const matchesStatus =
            state.filterStatus === 'all' || obj.status === state.filterStatus;

          const matchesPriority =
            state.filterPriority === 'all' || obj.priority === state.filterPriority;

          const matchesCategory =
            state.filterCategory === 'all' || obj.category === state.filterCategory;

          const matchesCoreFilter =
            !state.showCoreOnly || obj.isCore;

          return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesCoreFilter;
        });
      },

      loadDataFromSupabase: async () => {
        // Try normalized schema first, fallback to old method if no data found
        await get().loadFromNormalizedSchema();
        
        // If no data found in normalized schema, try legacy method
        const currentChapters = get().chapters;
        if (currentChapters.length === 0) {
          console.log('No data found in normalized schema, trying legacy method...');
          await get().loadDataFromLegacy();
        }
      },

      loadDataFromLegacy: async () => {
        set({ isLoadingFromSupabase: true });
        try {
          // First, load allowed chapters from nabh_chapters table
          const chaptersResult = await loadChaptersFromSupabase();
          if (!chaptersResult.success || !chaptersResult.data) {
            console.error('Failed to load chapters from nabh_chapters table:', chaptersResult.error);
            set({ chapters: [], isLoadingFromSupabase: false });
            return;
          }

          // Create map of chapter codes to chapter data from nabh_chapters table
          const allowedChaptersMap = new Map();
          chaptersResult.data.forEach(chapter => {
            allowedChaptersMap.set(chapter.name.toUpperCase(), chapter);
          });

          // Then load objectives data
          const objectivesResult = await loadAllObjectiveEditsFromSupabase();
          if (objectivesResult.success && objectivesResult.data) {
            // Build chapters structure only for allowed chapters
            const chaptersMap = new Map<string, Chapter>();
            
            // Process each objective from Supabase
            for (const [objectiveCode, supabaseData] of Object.entries(objectivesResult.data)) {
              if (supabaseData.title && supabaseData.description) {
                const chapterCode = objectiveCode.split('.')[0];
                
                // Skip if this chapter is not allowed
                if (!allowedChaptersMap.has(chapterCode)) {
                  continue;
                }
                
                const chapterId = chapterCode.toLowerCase();
                
                // Create chapter if it doesn't exist
                if (!chaptersMap.has(chapterId)) {
                  const chapterData = allowedChaptersMap.get(chapterCode);
                  chaptersMap.set(chapterId, {
                    id: chapterId,
                    code: chapterCode,
                    name: chapterCode,
                    fullName: chapterData?.description || chapterCode,
                    type: getChapterType(chapterCode) as any,
                    objectives: [],
                  });
                }
                
                // Create objective element
                const objective: ObjectiveElement = {
                  id: objectiveCode.toLowerCase().replace(/\./g, '-'),
                  code: objectiveCode,
                  title: supabaseData.title.substring(0, 100) + (supabaseData.title.length > 100 ? '...' : ''),
                  description: supabaseData.description,
                  hindiExplanation: supabaseData.hindiExplanation || '',
                  category: (supabaseData as any).category || 'Commitment',
                  isCore: (supabaseData as any).category === 'Core',
                  evidencesList: supabaseData.evidencesList || '',
                  evidenceLinks: supabaseData.evidenceLinks || '',
                  evidenceFiles: supabaseData.evidenceFiles || [],
                  youtubeVideos: supabaseData.youtubeVideos || [],
                  trainingMaterials: supabaseData.trainingMaterials || [],
                  sopDocuments: supabaseData.sopDocuments || [],
                  priority: supabaseData.priority || '',
                  assignee: supabaseData.assignee || '',
                  status: supabaseData.status || '',
                  startDate: supabaseData.startDate || '',
                  endDate: supabaseData.endDate || '',
                  deliverable: supabaseData.deliverable || '',
                  notes: supabaseData.notes || '',
                  auditorPriorityItems: supabaseData.auditorPriorityItems || [],
                };
                
                // Add objective to chapter
                chaptersMap.get(chapterId)!.objectives.push(objective);
              }
            }
            
            // Convert map to array and sort by chapter_number from nabh_chapters table
            const chapters = Array.from(chaptersMap.values()).sort((a, b) => {
              const chapterDataA = allowedChaptersMap.get(a.code);
              const chapterDataB = allowedChaptersMap.get(b.code);
              return (chapterDataA?.chapter_number || 0) - (chapterDataB?.chapter_number || 0);
            });
            
            set({ chapters, isLoadingFromSupabase: false });
          } else {
            console.error('Failed to load objectives from Supabase:', objectivesResult.error);
            set({ chapters: [], isLoadingFromSupabase: false });
          }
        } catch (error) {
          console.error('Error loading data from Supabase:', error);
          set({ chapters: [], isLoadingFromSupabase: false });
        }
      },

      loadFromNormalizedSchema: async () => {
        set({ isLoadingFromSupabase: true });
        try {
          const result = await loadAllNormalizedData();
          if (!result.success || !result.data) {
            console.error('Failed to load normalized data:', result.error);
            set({ chapters: [], isLoadingFromSupabase: false });
            return;
          }

          const { chapters: nabhChapters, standards, elements } = result.data;
          
          // Build chapters structure from normalized data
          const chapters: Chapter[] = nabhChapters.map(nabhChapter => {
            // Get standards for this chapter
            const chapterStandards = standards.filter(s => s.chapter_id === nabhChapter.id);
            
            // Get all elements for this chapter (across all standards)
            const chapterElements: ObjectiveElement[] = [];
            
            chapterStandards.forEach(standard => {
              const standardElements = elements.filter(e => e.standard_id === standard.id);
              
              standardElements.forEach(element => {
                const objective: ObjectiveElement = {
                  id: element.id,
                  code: `${nabhChapter.name}.${standard.standard_number}.${element.element_number}`,
                  title: element.description.substring(0, 100) + (element.description.length > 100 ? '...' : ''),
                  description: element.description,
                  hindiExplanation: element.interpretation || '',
                  category: element.is_core ? 'Core' : 'Commitment',
                  isCore: element.is_core,
                  evidencesList: element.evidence_links || '',
                  evidenceLinks: element.evidence_links || '',
                  evidenceFiles: [],
                  youtubeVideos: [],
                  trainingMaterials: [],
                  sopDocuments: [],
                  auditorPriorityItems: [],
                  priority: element.is_core ? 'CORE' : '',
                  assignee: element.assignee || '',
                  status: element.status === 'Not Started' ? 'Not started' : element.status === 'In Progress' ? 'In progress' : element.status as Status,
                  startDate: '',
                  endDate: '',
                  deliverable: '',
                  notes: element.notes || '',
                  infographicSvg: element.infographic_svg,
                  infographicDataUrl: element.infographic_data_url,
                };
                
                chapterElements.push(objective);
              });
            });
            
            return {
              id: nabhChapter.name.toLowerCase(),
              code: nabhChapter.name,
              name: nabhChapter.name,
              fullName: nabhChapter.description,
              type: getChapterType(nabhChapter.name) as ChapterType,
              objectives: chapterElements.sort((a, b) => a.code.localeCompare(b.code)),
              standards: chapterStandards.map(s => ({
                code: s.standard_number,
                title: s.name,
                intent: s.description,
                elements: chapterElements.filter(e => e.code.includes(s.standard_number)),
              })),
            };
          });
          
          // Sort chapters by chapter_number
          chapters.sort((a, b) => {
            const aChapter = nabhChapters.find(c => c.name === a.code);
            const bChapter = nabhChapters.find(c => c.name === b.code);
            return (aChapter?.chapter_number || 0) - (bChapter?.chapter_number || 0);
          });
          
          set({ chapters, isLoadingFromSupabase: false });
        } catch (error) {
          console.error('Error loading normalized data:', error);
          set({ chapters: [], isLoadingFromSupabase: false });
        }
      },
    }),
    {
      name: 'nabh-chapters-controlled',
      version: 1,
      migrate: () => {
        // Fresh start - all data comes from nabh_chapters table + nabh_objective_edits
        // Reset to empty state and let loadDataFromSupabase populate
        return {
          chapters: [],
          selectedChapter: null,
          selectedObjective: null,
          searchQuery: '',
          filterStatus: 'all',
          filterPriority: 'all',
          filterCategory: 'all',
          showCoreOnly: false,
          isLoadingFromSupabase: false,
        };
      },
    }
  )
);
