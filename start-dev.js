const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Utility function to create shell-specific commands
const createCommand = (command, isWindows) => {
  if (isWindows) {
    return { cmd: 'cmd.exe', args: ['/c', command] };
  } else {
    return { cmd: 'sh', args: ['-c', command] };
  }
};

// Detect the platform
const isWindows = os.platform() === 'win32';

// Start the backend server
console.log('Starting Laravel backend...');
const backendCmd = createCommand('cd backend && php artisan serve', isWindows);
const backendProcess = spawn(backendCmd.cmd, backendCmd.args, {
  stdio: 'inherit',
  shell: true
});

// Start the frontend development server
console.log('Starting React frontend...');
const frontendCmd = createCommand('cd frontend && npm run dev', isWindows);
const frontendProcess = spawn(frontendCmd.cmd, frontendCmd.args, {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
const handleExit = () => {
  console.log('Shutting down development servers...');
  frontendProcess.kill();
  backendProcess.kill();
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

console.log('\nDevelopment servers started:');
console.log('- Frontend: http://localhost:5173');
console.log('- Backend: http://localhost:8000');
console.log('\nPress Ctrl+C to stop both servers.\n'); 