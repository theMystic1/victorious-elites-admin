import Card from "./card";

const TableOverflow = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card className={`overflow-x-auto w-full h-full z-10 ${className}`}>
      {children}
    </Card>
  );
};

const Table = ({ children }: { children?: React.ReactNode }) => {
  return <table className="w-full h-full z-10">{children}</table>;
};

const Tr = ({ children }: { children?: React.ReactNode }) => {
  return <tr className="">{children}</tr>;
};

const Th = ({ children }: { children?: React.ReactNode }) => {
  return (
    <th className="text-start border-b border-b-gray-300 py-4">{children}</th>
  );
};

const Td = ({ children }: { children?: React.ReactNode }) => {
  return (
    <td className="py-3  border-b border-b-gray-300 text-sm">{children}</td>
  );
};

const Tbody = ({ children }: { children?: React.ReactNode }) => {
  return <tbody>{children}</tbody>;
};

const TableHeader = ({ children }: { children?: React.ReactNode }) => {
  return <thead className="px-2 bg-gray-100 rounded-lg">{children}</thead>;
};

export { TableOverflow, Table, Tr, Th, Td, Tbody, TableHeader };
