import { redirect } from 'next/navigation';

export default function SubmissionsPage() {
  // Redirect to the new dashboard submissions page
  redirect('/dashboard/submissions');
}
