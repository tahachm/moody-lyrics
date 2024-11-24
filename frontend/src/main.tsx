import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Amplify} from 'aws-amplify';
import awsExports from './aws-exports.ts'; // Import the configuration

Amplify.configure((awsExports as any))// Configure Amplify

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
