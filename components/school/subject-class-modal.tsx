import Modal from "../ui/modal";
import InputContainer from "../ui/reusables/input-container";
import { useForm } from "react-hook-form";
import ErrorText from "../auth/error-text";
import SearchableNativeSelect from "../ui/reusables/select";
import { useEffect, useState } from "react";
import {
  ClassNameType,
  ClassType,
  SubjectClassType,
  SubjectType,
} from "@/utils/types";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import { addNewSubjectClass } from "@/lib/api/endpoints/subjects";

const SubjectClassesModal = ({
  open,
  onClose,
  refetchStaff,
  isEdit,
  editClass,
  classes,
  subjectId,
  subjects,
}: {
  open: boolean;
  onClose: () => void;
  refetchStaff: () => void;
  isEdit?: boolean;
  editClass?: SubjectClassType;
  classes?: ClassType[];
  subjectId?: string;
  subjects?: SubjectType[];
}) => {
  const [mutating, setMutating] = useState(false);
  const [name, setName] = useState<ClassNameType | "">("");
  const [classId, setClassId] = useState<string | "">("");
  const [term, setTerm] = useState("");

  // console.log(selectedActive);

  // useEffect(() => {
  //   if (editClass) {
  //     setName(editClass.name);
  //     setClassId(editClass.classId);
  //     setTerm(editClass.term);
  //   }
  // }, [editClass]);

  const { handleSubmit } = useForm<SubjectClassType>();

  const handleClose = () => {
    onClose();

    setName("");
    setClassId("");
    setTerm("");
    // setIsActive(false);
  };

  const onSubmit = async () => {
    setMutating(true);
    toast.loading(isEdit ? "Updating Class..." : "Adding Class...");

    try {
      const classData: SubjectClassType = {
        // subjectId: subjectId ?? "",
        // classId: classId,
        term: [term],
      };

      classes?.length
        ? await addNewSubjectClass(subjectId!, classData, classId!)
        : await addNewSubjectClass(classId!, classData, subjectId!);

      await refetchStaff();
      handleClose();
      toast.remove();
      toast.success(
        isEdit ? "Class updated successfully" : "Class added successfully",
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
        <InputContainer label={classes?.length ? "Class" : "Subject"}>
          <SearchableNativeSelect
            options={
              classes?.map((c) => ({
                value: c._id as string,
                label: c.name,
              })) ??
              subjects?.map((s) => ({
                value: s._id as string,
                label: s.name,
              })) ??
              []
            }
            value={classId}
            onChange={(value) => setClassId(value)}
            placeholder={classes?.length ? "Select Class" : "Select Subject"}
          />
        </InputContainer>

        <InputContainer label="Term">
          <SearchableNativeSelect
            options={[
              {
                value: "First",
                label: "First",
              },
              {
                value: "Second",
                label: "Second",
              },
              {
                value: "Third",
                label: "Third",
              },
              {
                value: "All",
                label: "All",
              },
            ]}
            value={term}
            onChange={(value) => setTerm(value as string)}
            placeholder="Select Class Terms"
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

export default SubjectClassesModal;
