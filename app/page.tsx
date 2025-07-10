import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard or login page
  redirect('/dashboard');
  
  // This won't be rendered, but we need to return something
  return null;
}

