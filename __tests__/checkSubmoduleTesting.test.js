// import { exec } from 'child_process';

// // Function to promisify exec for easier use with async/await
// const execPromise = (cmd) => 
//   new Promise((resolve, reject) => {
//     exec(cmd, (error, stdout, stderr) => {
//       if (error) {
//         // Attach stdout and stderr to the error object for better debugging
//         error.stdout = stdout;
//         error.stderr = stderr;
//         reject(error);
//       } else {
//         resolve({ stdout, stderr, code: 0 }); // Explicitly resolve with code 0 for success
//       }
//     });
//   });

// Check that the mrjsio submodule is up to date
// - note: doing this as a test instead of another github action is that
//         it's a simpler process to ask the user to update following the
//         test failure considering it's more locally dependent.
test('mrjsio submodule is up to date', async () => {
  // Need to comment out this testing file as it causes an improper merge/stash/branch setup when run with 
  // the rest of the tests automatically. Will bring it back as part of #608 being resolved
  console.log('SKIPPING THIS FOR NOW - see pending issue: https://github.com/Volumetrics-io/mrjs/issues/608');
//   try {
//     const result = await execPromise('./scripts/check-if-submodule-needs-update.sh ./samples/mrjsio');
//     // If the promise resolves, it means the script exited with code 0
//     expect(result.code).toBe(0);
//   } catch (err) {
//     // If the script exits with a non-zero exit code, it will be caught here
//     console.error('Script failed to execute:', err.stderr);
//     console.log('!!! mrjsio submodule needs to be updated !!! run: `npm run update-submodules` and it will handle the rest for you :)');
    
//     // Fail the test by checking the exit code - since success is 0, checking against
//     // 0 is guaranteed to trigger a failure.
//     expect(err.code).toBe(0);
//   }
});
