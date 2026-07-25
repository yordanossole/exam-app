import HomeScreen from '../screens/HomeScreen';
import { getExamLibrarySummary, getGrades } from '../lib/db';

export const dynamic = 'force-dynamic';

export default function Page() {
  const library = getGrades().map(({ grade }) => getExamLibrarySummary(grade));
  return <HomeScreen library={library} />;
}
