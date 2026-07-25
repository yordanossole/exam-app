import { getGrades, getSubjectsByGrade } from '../../lib/db';
import PracticeLanding from '../../screens/practice/PracticeLanding';

export const dynamic = 'force-dynamic';

export default function Page() {
  const catalog = getGrades().map(({ grade }) => ({
    grade,
    subjects: getSubjectsByGrade(grade),
  }));

  return <PracticeLanding catalog={catalog} />;
}
