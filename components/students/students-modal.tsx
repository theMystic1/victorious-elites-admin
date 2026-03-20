import Modal from "../ui/modal";
import InputContainer from "../ui/reusables/input-container";
import { useForm } from "react-hook-form";
import ErrorText from "../auth/error-text";
import SearchableNativeSelect from "../ui/reusables/select";
import { useEffect, useState } from "react";
import { ClassType, SessionType, StudentsType } from "@/utils/types";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import {
  addStudent,
  deleteStudent,
  updateStudent,
} from "@/lib/api/endpoints/students";
import { CustomButton } from "../ui/reusables/custom-btn";
import { useParams, useRouter } from "next/navigation";

type GenderType = "MALE" | "FEMALE";

const StudentsModal = ({
  fetchedClasses,
  fetchedSessions,
  open,
  onClose,
  refetchStudents,
  isEdit,
  editStudent,
}: {
  fetchedClasses: ClassType[];
  fetchedSessions: SessionType[];
  open: boolean;
  onClose: () => void;
  refetchStudents: () => void;
  isEdit?: boolean;
  editStudent?: StudentsType;
}) => {
  const [selectedClass, setSelectedClass] = useState(
    editStudent?.curClassId ?? "",
  );
  const [selectedSession, setSelectedSession] = useState(
    editStudent?.curSessionId ?? "",
  );
  const [selectedGender, setSelectedGender] = useState<GenderType>(
    editStudent?.gender ?? "MALE",
  );
  const [mutating, setMutating] = useState(false);

  console.log(editStudent);

  useEffect(() => {
    if (editStudent) {
      setSelectedClass((editStudent.curClassId as ClassType)?._id as string);
      setSelectedSession(
        (editStudent.curSessionId as SessionType)?._id as string,
      );
      setSelectedGender(editStudent.gender as GenderType);

      setValue("fullName", editStudent.fullName);
      setValue("age", editStudent.age);
      setValue("studentsId", editStudent.studentsId);
    }
  }, [editStudent]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<StudentsType>();

  const handleClose = () => {
    onClose();
    setSelectedClass("");
    setSelectedSession("");
    setSelectedGender("MALE");
    setValue("fullName", "");
    setValue("age", 0);
    setValue("studentsId", "");
  };

  const onSubmit = async (data: StudentsType) => {
    setMutating(true);
    toast.loading("Creating student...");
    try {
      const studentData = {
        ...data,
        curClassId: selectedClass,
        gender: selectedGender?.toUpperCase() as GenderType,
        curSessionId: selectedSession,
      };
      const student =
        isEdit && editStudent
          ? await updateStudent(editStudent?._id!, studentData)
          : await addStudent(studentData);
      refetchStudents();
      handleClose();
      toast.remove();
      toast.success(
        isEdit
          ? "Student updated successfully"
          : "Student created successfully",
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
      title={isEdit ? "Edit Student" : "New Student"}
      description={
        isEdit ? "Edit student details" : "Enter new student details"
      }
    >
      <div className="flex flex-col gap-3 overflow-y-auto">
        <InputContainer label="Full Name">
          <div className="w-full input flex items-center justify-between">
            <input
              type="text"
              className="w-full iput"
              placeholder="Enter student full name"
              {...register("fullName", {
                required: "Full name is required",
              })}
            />
          </div>
          {errors.fullName && (
            <ErrorText error={errors.fullName.message?.toString() ?? ""} />
          )}
        </InputContainer>
        <InputContainer label="Age">
          <div className="w-full input flex items-center justify-between">
            <input
              type="number"
              className="w-full iput"
              placeholder="Enter student age"
              {...register("age", {
                required: "Age is required",
              })}
            />
          </div>
          {errors.age && (
            <ErrorText error={errors.age.message?.toString() ?? ""} />
          )}
        </InputContainer>

        <InputContainer label="Gender">
          <SearchableNativeSelect
            options={[
              { value: "MALE", label: "MALE" },
              { value: "FEMALE", label: "FEMALE" },
            ]}
            value={selectedGender!}
            onChange={(value) => setSelectedGender(value as any)}
            placeholder="Select student gender"
          />
        </InputContainer>

        <InputContainer label="Reg No.">
          <div className="w-full input flex items-center justify-between">
            <input
              type="text"
              className="w-full iput"
              placeholder="Enter student Reg Number"
              {...register("studentsId", {
                required: "Reg No. is required",
              })}
            />
          </div>
          {errors.studentsId && (
            <ErrorText error={errors.studentsId.message?.toString() ?? ""} />
          )}
        </InputContainer>

        <InputContainer label="Class">
          <SearchableNativeSelect
            options={fetchedClasses.map((cls) => ({
              value: cls._id!,
              label: cls.name?.includes("P")
                ? `Primary ${cls.name?.split("")[1]} ${cls.arm}`
                : `${cls.name} ${cls.arm}`,
              disabled: !cls.isActive,
            }))}
            value={selectedClass as string}
            onChange={(value) => setSelectedClass(value)}
            placeholder="Select student class"
            // className="input"
          />
        </InputContainer>
        <InputContainer label="Session">
          <SearchableNativeSelect
            options={fetchedSessions.map((session) => ({
              value: session._id!,
              label: session.session,
            }))}
            value={selectedSession as string}
            onChange={(value) => setSelectedSession(value)}
            placeholder="Select student session"
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

export default StudentsModal;

export const DeleteConfirmModal = ({
  onClose,
  open,
  item,
  refetch,
  studentId,
  onDeleteAction,
}: {
  onClose: () => void;
  open: boolean;
  item: string;
  refetch: () => void;
  studentId: string;
  onDeleteAction?: (id: string) => Promise<void>;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { studentsId: ID } = useParams();

  const handleDelete = async () => {
    setIsDeleting(true);
    toast.loading("Deleting...");
    try {
      const deleted = onDeleteAction
        ? await onDeleteAction(studentId)
        : await deleteStudent(studentId);

      refetch();
      onClose();
      toast.remove();
      toast.success("Delete successful");
      if (ID) router.back();
    } catch (error: unknown) {
      const { message } = toApiError(error);
      toast.remove();
      toast.error(message);
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-black">Confirm Deletion</h1>
        <p>Are you sure you want to delete this {item}?</p>

        <p>This action cannot be undone.</p>
        <div className="flex gap-2">
          <CustomButton
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};
