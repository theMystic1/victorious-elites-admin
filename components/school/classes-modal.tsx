import Modal from "../ui/modal";
import InputContainer from "../ui/reusables/input-container";
import { useForm } from "react-hook-form";
import ErrorText from "../auth/error-text";
import SearchableNativeSelect from "../ui/reusables/select";
import { useEffect, useState } from "react";
import {
  ClassNameType,
  ClassType,
  LevelType,
  SessionType,
  TermType,
} from "@/utils/types";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import { addStaff, updateStaff } from "@/lib/api/endpoints/auth";
import DatePicker from "../ui/reusables/date-selector";
import { addNewClass, updateClass } from "@/lib/api/endpoints/school";
import { classLevels, groupClasses } from "@/lib/helpers/constants";

const ClassesModal = ({
  open,
  onClose,
  refetchStaff,
  isEdit,
  editClass,
}: {
  open: boolean;
  onClose: () => void;
  refetchStaff: () => void;
  isEdit?: boolean;
  editClass?: ClassType;
}) => {
  const [mutating, setMutating] = useState(false);
  const [name, setName] = useState<ClassNameType | "">(editClass?.name ?? "");
  const [level, setLevel] = useState<LevelType | "">(editClass?.level ?? "");
  const [arm, setArm] = useState(editClass?.arm ?? "");
  const [isActive, setIsActive] = useState(editClass?.isActive ?? true);

  // console.log(selectedActive);

  useEffect(() => {
    if (editClass) {
      setName(editClass.name);
      setLevel(editClass.level);
      setArm(editClass.arm);
      setIsActive(true);
    }
  }, [editClass]);

  const { handleSubmit } = useForm<ClassType>();

  const handleClose = () => {
    onClose();

    setName("");
    setLevel("");
    setArm("");
    setIsActive(false);
  };

  const onSubmit = async () => {
    setMutating(true);
    toast.loading(isEdit ? "Updating Class..." : "Adding Class...");

    try {
      const classData: ClassType = {
        name: name as ClassNameType,
        level: level as LevelType,
        arm: arm,
        isActive: isEdit ? isActive : true,
      };

      isEdit
        ? await updateClass(editClass?._id!, classData)
        : await addNewClass(classData);

      await refetchStaff();
      handleClose();
      toast.remove();
      toast.success(
        isEdit ? "Class updated successfully" : "Class created successfully",
      );
    } catch (error: unknown) {
      console.error(error);
      const { message } = toApiError(error);
      toast.remove();
      toast.error(message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? `Edit Class` : `Add Class`}
      description={isEdit ? "Edit Class details" : `Enter Class details`}
    >
      <div className="flex flex-col gap-3 overflow-y-auto">
        <InputContainer label="Level">
          <SearchableNativeSelect
            options={classLevels}
            value={level}
            onChange={(value) => {
              setLevel(value as LevelType);
              setName("");
            }}
            placeholder="Select Level"
          />
        </InputContainer>
        {level && (
          <InputContainer label="Class Name">
            <SearchableNativeSelect
              options={groupClasses[level as LevelType]}
              value={name}
              onChange={(value) => setName(value as ClassNameType)}
              placeholder="Select Class Name"
            />
          </InputContainer>
        )}

        <InputContainer label="Sub class (arm)">
          <SearchableNativeSelect
            options={[
              {
                value: "A",
                label: "A",
              },
              {
                value: "B",
                label: "B",
              },
              {
                value: "C",
                label: "C",
              },
              {
                value: "D",
                label: "D",
              },
            ]}
            value={arm}
            onChange={(value) => setArm(value)}
            placeholder="Select Sub class Class"
          />
        </InputContainer>

        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit(onSubmit)}
        >
          {mutating ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default ClassesModal;
