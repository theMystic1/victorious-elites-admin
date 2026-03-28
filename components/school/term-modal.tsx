import Modal from "../ui/modal";
import InputContainer from "../ui/reusables/input-container";
import { useForm } from "react-hook-form";
import ErrorText from "../auth/error-text";
import SearchableNativeSelect from "../ui/reusables/select";
import { useEffect, useState } from "react";
import {
  ClassType,
  METype,
  SessionType,
  StudentsType,
  TermType,
  USERROLE,
} from "@/utils/types";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import { addStaff, updateStaff } from "@/lib/api/endpoints/auth";
import DatePicker from "../ui/reusables/date-selector";
import {
  addNewSession,
  addSessionTerm,
  updateSession,
  updateSessionTerm,
} from "@/lib/api/endpoints/school";

const TermModal = ({
  open,
  onClose,
  refetchStaff,
  isEdit,
  editTerm,
  curSession,
  lastTerm,
}: {
  open: boolean;
  onClose: () => void;
  refetchStaff: () => void;
  curSession: SessionType;
  isEdit?: boolean;
  editTerm?: TermType;
  lastTerm?: "First" | "Second" | "Third" | "";
}) => {
  const [mutating, setMutating] = useState(false);
  // const [term, setTerm] = useState(editTerm?.term ?? "First");

  const [date, setDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // console.log(selectedActive);

  useEffect(() => {
    if (editTerm) {
      setValue("startDate", editTerm.startDate);
      setValue("endDate", editTerm.endDate);
      setValue("isActive", editTerm.isActive);
      setDate(new Date(editTerm.startDate));
      setEndDate(new Date(editTerm.endDate));
    }
  }, [editTerm]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TermType>();

  const handleClose = () => {
    onClose();
    setValue("startDate", new Date()?.toDateString());
    setValue("endDate", new Date()?.toDateString());
    setValue("isActive", false);
    setDate(null);
    setEndDate(null);
  };

  const curTerm = !lastTerm
    ? "First"
    : lastTerm === "First"
      ? "Second"
      : "Third";

  const onSubmit = async (data: TermType) => {
    if (!date) {
      toast.error("Please select a start date");
      return;
    }

    setMutating(true);
    toast.loading(isEdit ? "Updating Term..." : "Adding Term...");

    try {
      const sesionData = {
        ...data,
        term: isEdit ? lastTerm : curTerm,
        startDate: date?.toDateString() as string,
        endDate: endDate?.toDateString() as string,
        ...(isEdit ? {} : { isActive: curSession?.isActive ?? false }),
        sessionId: curSession?._id!,
      };
      isEdit
        ? await updateSessionTerm(editTerm?._id!, sesionData as TermType)
        : await addSessionTerm(curSession?._id!, sesionData as TermType);

      refetchStaff();
      handleClose();
      toast.remove();
      toast.success(
        isEdit
          ? "Session updated successfully"
          : "Session created successfully",
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
      title={isEdit ? `Edit ${lastTerm} Term` : `Add ${curTerm} Term`}
      description={
        isEdit ? "Edit Term details" : `Enter ${curTerm} Term details`
      }
    >
      <div className="flex flex-col gap-3 overflow-y-auto">
        <p className="text-sm font-black">
          Term to create is auto-filled based on the last recorded term for the
          session.
        </p>

        <InputContainer label="Term">
          {/*<SearchableNativeSelect
            options={terms}
            value={term}
            onChange={(value) => setTerm(value as "First" | "Second" | "Third")}
            placeholder="SelectTerm"
          />*/}

          <input
            type="text"
            disabled={true}
            value={`${isEdit ? lastTerm : curTerm} Term`}
            className="input bg-gray-200 cursor-not-allowed"
          />
        </InputContainer>

        <InputContainer>
          {/*<div className="w-full input flex items-center justify-between">*/}
          <DatePicker
            label="Start Date"
            value={date}
            onChange={setDate}
            minDate={new Date(2001, 0, 1)}
          />
          {/*</div>*/}
        </InputContainer>
        <InputContainer>
          {/*<div className="w-full input flex items-center justify-between">*/}
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            minDate={new Date(2001, 0, 1)}
            disabled={!date}
          />
          {/*</div>*/}
          {errors.endDate && (
            <ErrorText error={errors.endDate.message?.toString() ?? ""} />
          )}
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

export default TermModal;
