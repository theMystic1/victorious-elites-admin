import Modal from "../ui/modal";
import InputContainer from "../ui/reusables/input-container";
import { useForm } from "react-hook-form";
import ErrorText from "../auth/error-text";
import SearchableNativeSelect from "../ui/reusables/select";
import { useEffect, useState } from "react";
import { SubjectType } from "@/utils/types";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";

import { addNewSubject, updateSubject } from "@/lib/api/endpoints/subjects";

const SubjectsModal = ({
  open,
  onClose,
  refetchStudents,
  isEdit,
  editStudent,
}: {
  open: boolean;
  onClose: () => void;
  refetchStudents: () => void;
  isEdit?: boolean;
  editStudent?: SubjectType;
}) => {
  const [active, setActive] = useState(editStudent?.isActive ?? true);

  const [mutating, setMutating] = useState(false);

  // console.log(editStudent);

  useEffect(() => {
    if (editStudent) {
      setActive(editStudent.isActive as boolean);
      setValue("name", editStudent.name);
      setValue("code", editStudent.code);
    }
  }, [editStudent]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SubjectType>();

  const handleClose = () => {
    onClose();
    setActive(true);
    setValue("name", "");
    setValue("code", "");
  };

  const onSubmit = async (data: SubjectType) => {
    setMutating(true);
    toast.loading(isEdit ? "Updating Subject..." : "Creating Subject...");
    try {
      const subjectData = {
        ...data,
        isActive: active,
      };
      const subject =
        isEdit && editStudent
          ? await updateSubject(editStudent?._id!, subjectData as SubjectType)
          : await addNewSubject(subjectData as SubjectType);
      await refetchStudents();
      handleClose();
      toast.remove();
      toast.success(
        isEdit
          ? "Subject updated successfully"
          : "Subject created successfully",
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
      title={isEdit ? "Edit Subject" : "New Subject"}
      description={
        isEdit ? "Edit subject details" : "Enter new subject details"
      }
      footer={
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit(onSubmit)}
        >
          {mutating ? "Saving..." : "Save"}
        </button>
      }
    >
      <div className="flex flex-col gap-3 overflow-y-auto max-h-120">
        <InputContainer label="Name">
          <div className="w-full input flex items-center justify-between">
            <input
              type="text"
              className="w-full iput"
              placeholder="Enter subject name"
              {...register("name", {
                required: "Name is required",
              })}
            />
          </div>
          {errors.name && (
            <ErrorText error={errors.name.message?.toString() ?? ""} />
          )}
        </InputContainer>
        <InputContainer label="Code">
          <div className="w-full input flex items-center justify-between">
            <input
              type="text"
              className="w-full iput"
              placeholder="Enter subject code"
              {...register("code", {
                required: "Code is required",
              })}
            />
          </div>
          {errors.code && (
            <ErrorText error={errors.code.message?.toString() ?? ""} />
          )}
        </InputContainer>
        {isEdit ? (
          <InputContainer label="Status">
            <SearchableNativeSelect
              options={[
                { value: "ACTIVE", label: "ACTIVE" },
                { value: "INACTIVE", label: "INACTIVE" },
              ]}
              value={active ? "ACTIVE" : "INACTIVE"}
              onChange={(value) => setActive(value === "ACTIVE" ? true : false)}
              placeholder="Select subject status"
            />
          </InputContainer>
        ) : null}

        {/*<button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit(onSubmit)}
        >
          {mutating ? "Saving..." : "Save"}
        </button>
      */}
      </div>
    </Modal>
  );
};

export default SubjectsModal;
