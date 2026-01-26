import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chapter, ObjectiveElement, Status, ElementCategory } from '../types/nabh';
import { nabhData } from '../data/nabhData';

interface NABHStore {
  chapters: Chapter[];
  selectedChapter: string | null;
  selectedObjective: string | null;
  searchQuery: string;
  filterStatus: Status | 'all';
  filterPriority: string;
  filterCategory: ElementCategory | 'all';
  showCoreOnly: boolean;

  setSelectedChapter: (chapterId: string | null) => void;
  setSelectedObjective: (objectiveId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: Status | 'all') => void;
  setFilterPriority: (priority: string) => void;
  setFilterCategory: (category: ElementCategory | 'all') => void;
  setShowCoreOnly: (show: boolean) => void;
  updateObjective: (chapterId: string, objectiveId: string, updates: Partial<ObjectiveElement>) => void;
  getFilteredObjectives: (chapterId: string) => ObjectiveElement[];
}

export const useNABHStore = create<NABHStore>()(
  persist(
    (set, get) => ({
      chapters: nabhData,
      selectedChapter: null,
      selectedObjective: null,
      searchQuery: '',
      filterStatus: 'all',
      filterPriority: 'all',
      filterCategory: 'all',
      showCoreOnly: false,

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
    }),
    {
      name: 'nabh-evidence-storage',
    }
  )
);
