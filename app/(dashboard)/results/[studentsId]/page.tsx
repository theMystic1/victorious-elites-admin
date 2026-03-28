import SingleStudent from "@/components/students/single-student";

const SingleStudentsPage = async ({
  params,
}: {
  params: { studentsId: string };
}) => {
  const { studentsId } = await params;
  return <SingleStudent studentsId={studentsId} />;
};

export default SingleStudentsPage;
