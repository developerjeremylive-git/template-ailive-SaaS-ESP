import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

// Define a global function to call useMcpTool
(window as any).useMcpTool = async ({ serverName, toolName, toolArguments }: { serverName: string; toolName: string; toolArguments: any }) => {
  try {
    const response = await (window as any).mcp.callTool(serverName, toolName, toolArguments);
    return response;
  } catch (error) {
    console.error('Error calling MCP tool:', error);
    throw error;
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
