import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { seedDatabase, addRatingsToSubmissions } from '../../utils/seedDatabase';
import { supabase } from '../../lib/supabase';

const SeedDatabaseButton = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [skipRatings, setSkipRatings] = useState(false);

  // Check if submission_ratings table exists
  const checkRatingsTable = async () => {
    try {
      // Try to query the submission_ratings table
      const { error } = await supabase
        .from('submission_ratings')
        .select('id')
        .limit(1);
      
      // If there's an error, the table might not exist
      if (error) {
        console.warn('submission_ratings table might not exist:', error.message);
        setSkipRatings(true);
        return false;
      }
      
      return true;
    } catch (error) {
      console.warn('Error checking submission_ratings table:', error);
      setSkipRatings(true);
      return false;
    }
  };

  const handleSeedDatabase = async () => {
    if (!currentUser) {
      setResult({
        success: false,
        message: 'You must be logged in to seed the database.'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Check if ratings table exists
      const ratingsTableExists = await checkRatingsTable();
      
      // Seed the database with mock submissions
      const seedResult = await seedDatabase(currentUser.id);
      
      if (!seedResult.success) {
        setResult({
          success: false,
          message: `Failed to seed database: ${seedResult.error?.message || 'Unknown error'}`
        });
        setLoading(false);
        return;
      }
      
      // Add ratings to the submissions if the table exists and user didn't skip ratings
      if (ratingsTableExists && !skipRatings) {
        const ratingsResult = await addRatingsToSubmissions(currentUser.id);
        
        if (!ratingsResult.success) {
          // Check for specific error types
          const errorMessage = ratingsResult.error?.message || 'Unknown error';
          const errorCode = ratingsResult.error?.code;
          
          // Handle foreign key constraint violation
          if (errorCode === '23503' && errorMessage.includes('violates foreign key constraint')) {
            setResult({
              success: true, // Still mark as success since submissions were added
              message: 'Submissions added successfully! Ratings could not be added due to a foreign key constraint. This usually happens when using test accounts. Try using the "Skip adding ratings" option.'
            });
          } else {
            setResult({
              success: true, // Still mark as success since submissions were added
              message: `Submissions added successfully, but failed to add ratings: ${errorMessage}`
            });
          }
          setLoading(false);
          return;
        }
        
        setResult({
          success: true,
          message: 'Database seeded successfully with mock submissions and ratings!'
        });
      } else {
        setResult({
          success: true,
          message: 'Database seeded successfully with mock submissions! (Ratings were skipped)'
        });
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      setResult({
        success: false,
        message: `An unexpected error occurred: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Database Seeding</h2>
      <p className="text-gray-600 mb-4">
        This will add mock submissions {!skipRatings && 'and ratings'} to the database for testing purposes.
        All submissions will be associated with your user account.
      </p>
      
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="skipRatings"
          checked={skipRatings}
          onChange={(e) => setSkipRatings(e.target.checked)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="skipRatings" className="ml-2 block text-sm text-gray-700">
          Skip adding ratings (use this if you don't have a submission_ratings table or are encountering errors)
        </label>
      </div>
      
      <button
        onClick={handleSeedDatabase}
        disabled={loading || !currentUser}
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-transparent ${
          loading || !currentUser
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Seeding Database...
          </>
        ) : (
          'Seed Database with Mock Data'
        )}
      </button>
      
      {result && (
        <div className={`mt-4 p-3 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default SeedDatabaseButton; 