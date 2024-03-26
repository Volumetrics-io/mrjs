import { exec } from 'child_process';

// Function to promisify exec for easier use with async/await
const execPromise = (cmd) => 
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stderr });
      } else {
        resolve(stdout);
      }
    });
  });

// Check that the mrjsio submodule is up to date
// - note: doing this as a test instead of another github action is that
//         it's a simpler process to ask the user to update following the
//         test failure considering it's more locally dependent.
test('mrjsio submodule is up to date', async () => {
  try {
    const result = await execPromise('./scripts/check-if-submodule-needs-update.sh ./samples/mrjsio');
    expect(result.trim()).toBe('0');
  } catch (err) {
    console.error('Script failed to execute:', err.stderr, err.error);
    console.log('!!! mrjsio submodule needs to be updated !!! run: `npm run update-submodules` and it will handle the rest for you :)');
    throw err.error;
  }
});
