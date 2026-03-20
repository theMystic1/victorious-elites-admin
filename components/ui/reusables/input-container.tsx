"use client";

import { Cols, Row } from "./cols-rows";

const InputContainer = ({
  children,
  className,
  label,
  rightItem,
}: {
  children?: React.ReactNode;
  className?: string;
  label?: string;
  rightItem?: React.ReactNode;
}) => {
  return (
    <Cols className={`${className} gap-2  w-full`}>
      <Row className="justify-between gap-4">
        <label className="font-bold text-xm">{label}</label>
        {rightItem}
      </Row>

      {children}
    </Cols>
  );
};

export default InputContainer;
