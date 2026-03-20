const ErrorText = ({ error }: { error: string }) => {
  return <span className="text-red-600">{error}</span>;
};

export default ErrorText;
