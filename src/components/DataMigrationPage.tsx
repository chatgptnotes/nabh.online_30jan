import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { migrateAACData } from '../utils/dataMigrationHelper';

export default function DataMigrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; stats?: any; error?: string } | null>(null);

  const handleMigrateAAC = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const migrationResult = await migrateAACData();
      setResult(migrationResult);
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
        Data Migration Tools
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Migrate AAC Chapter Data
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This will insert the complete AAC (Access, Assessment and Continuity of Care) chapter data 
          into your normalized database schema with 8 standards and 23 objective elements.
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleMigrateAAC}
          disabled={isLoading}
          sx={{ mb: 2 }}
        >
          {isLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
          Migrate AAC Data
        </Button>

        {result && (
          <Alert 
            severity={result.success ? 'success' : 'error'}
            sx={{ mb: 2 }}
          >
            {result.success ? (
              <Box>
                <Typography variant="body1">
                  Migration completed successfully!
                </Typography>
                {result.stats && (
                  <Typography variant="body2">
                    Inserted: {result.stats.chapters} chapters, {result.stats.standards} standards, {result.stats.elements} elements
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body1">
                Migration failed: {result.error}
              </Typography>
            )}
          </Alert>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          AAC Chapter Structure
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Chapter:</strong> AAC - Access, Assessment and Continuity of Care
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Standards (8) and Elements (23):</strong>
        </Typography>
        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
          <li>AAC.1 - Healthcare Services Definition (4 elements)</li>
          <li>AAC.2 - Registration, Admission and Transfer Process (4 elements)</li>
          <li>AAC.3 - Patient Assessment and Re-assessment (3 elements)</li>
          <li>AAC.4 - Laboratory Services (2 elements)</li>
          <li>AAC.5 - Imaging Services (2 elements)</li>
          <li>AAC.6 - Laboratory and Imaging Safety Programme (3 elements)</li>
          <li>AAC.7 - Continuous Multidisciplinary Care (2 elements)</li>
          <li>AAC.8 - Discharge Process (2 elements)</li>
        </Box>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Each element contains detailed descriptions, interpretations, and implementation guidance 
          extracted from the NABH SHCO documentation.
        </Typography>
      </Paper>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Make sure you have created the three database tables first:
          <br />• nabh_chapters
          <br />• nabh_standards  
          <br />• nabh_objective_elements
          <br />
          After migration, refresh the page to see the data in the sidebar.
        </Typography>
      </Alert>
    </Box>
  );
}