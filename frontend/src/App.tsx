
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import EmployeesPage from './components/EmployeesPage';

const App = () => {
  const queryClient = new QueryClient();
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold underline">Keyhook Test Project</h1>
        <QueryClientProvider client={queryClient}>
          <EmployeesPage></EmployeesPage>
        </QueryClientProvider>
      </div>
    </>
  )
}

export default App
