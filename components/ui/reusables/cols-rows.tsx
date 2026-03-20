"use client";

const Cols = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <div className={`flex flex-col  ${className}`}>{children}</div>;
};
const Row = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <div className={`flex items-center  ${className}`}>{children}</div>;
};

export { Cols, Row };
