#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to verify all project files are in place
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  // Config files
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'vercel.json',
  
  // Documentation
  'README.md',
  'QUICKSTART.md',
  'DEPLOYMENT.md',
  'CUSTOMIZATION.md',
  'BUILD_SUMMARY.md',
  'START_HERE.md',
  'PROJECT_FILES.md',
  
  // Environment
  '.env.example',
  '.gitignore',
  
  // Database
  'database.sql',
  
  // App files
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
  'app/form/page.tsx',
  'app/submission/[id]/page.tsx',
  'app/admin/layout.tsx',
  'app/admin/login/page.tsx',
  'app/admin/dashboard/page.tsx',
  'app/admin/submissions/[id]/page.tsx',
  'app/api/submissions/route.ts',
  'app/api/submissions/[id]/route.ts',
  'app/api/submissions/export/route.ts',
  'app/api/auth/admin-login/route.ts',
  
  // Components
  'components/Navbar.tsx',
  'components/form/FormInputs.tsx',
  'components/form/MultiStepForm.tsx',
  'components/form/Progress.tsx',
  
  // Library
  'lib/supabase.ts',
  'lib/constants.ts',
  'lib/utils.ts',
  'lib/email.ts',
  'lib/contexts/FormContext.tsx',
  'lib/contexts/AdminAuthContext.tsx',
];

const REQUIRED_DIRECTORIES = [
  'app',
  'app/api',
  'app/api/auth',
  'app/api/auth/admin-login',
  'app/api/submissions',
  'app/api/submissions/[id]',
  'app/api/submissions/export',
  'app/admin',
  'app/admin/submissions',
  'app/admin/submissions/[id]',
  'app/form',
  'app/submission',
  'app/submission/[id]',
  'components',
  'components/form',
  'lib',
  'lib/contexts',
];

function verifyProject() {
  const projectRoot = process.cwd();
  let allGood = true;
  
  console.log('🔍 Verifying Century 21 Questionnaire Project...\n');
  
  // Check directories
  console.log('📁 Checking directories...');
  REQUIRED_DIRECTORIES.forEach(dir => {
    const dirPath = path.join(projectRoot, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`  ✅ ${dir}`);
    } else {
      console.log(`  ❌ ${dir} - MISSING`);
      allGood = false;
    }
  });
  
  console.log('\n📄 Checking files...');
  REQUIRED_FILES.forEach(file => {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      console.log(`  ✅ ${file}`);
    } else {
      console.log(`  ❌ ${file} - MISSING`);
      allGood = false;
    }
  });
  
  console.log('\n🔐 Checking environment setup...');
  
  const envFile = path.join(projectRoot, '.env.local');
  const envExampleFile = path.join(projectRoot, '.env.example');
  
  if (fs.existsSync(envFile)) {
    console.log('  ✅ .env.local exists');
  } else {
    console.log('  ⚠️  .env.local not found - You need to create it from .env.example');
  }
  
  if (fs.existsSync(envExampleFile)) {
    console.log('  ✅ .env.example exists');
  }
  
  console.log('\n📦 Checking package.json...');
  
  const packageJsonPath = path.join(projectRoot, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      'typescript',
      'tailwindcss',
      '@supabase/supabase-js',
    ];
    
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    requiredDeps.forEach(dep => {
      if (allDeps[dep]) {
        console.log(`  ✅ ${dep}`);
      } else {
        console.log(`  ❌ ${dep} - MISSING`);
        allGood = false;
      }
    });
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (allGood) {
    console.log('✨ Project verification PASSED! ✨\n');
    console.log('📋 Next steps:');
    console.log('  1. Create .env.local from .env.example');
    console.log('  2. Fill in your Supabase credentials');
    console.log('  3. Fill in your SMTP credentials');
    console.log('  4. Run: npm install');
    console.log('  5. Run: npm run dev');
    console.log('  6. Open: http://localhost:3000\n');
    console.log('📖 For detailed setup, read: QUICKSTART.md\n');
    process.exit(0);
  } else {
    console.log('⚠️  Project verification FAILED\n');
    console.log('❌ Some files or directories are missing.\n');
    console.log('📖 Please refer to PROJECT_FILES.md for complete file list.\n');
    process.exit(1);
  }
}

verifyProject();
