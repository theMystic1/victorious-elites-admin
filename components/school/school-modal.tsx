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
  USERROLE,
} from "@/utils/types";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import { addStaff, updateStaff } from "@/lib/api/endpoints/auth";
import DatePicker from "../ui/reusables/date-selector";
import { addNewSession, updateSession } from "@/lib/api/endpoints/school";

const SessionModal = ({
  open,
  onClose,
  refetchStaff,
  isEdit,
  editStaff,
}: {
  open: boolean;
  onClose: () => void;
  refetchStaff: () => void;
  isEdit?: boolean;
  editStaff?: SessionType;
}) => {
  const [mutating, setMutating] = useState(false);
  const [selectedActive, setSelectedActive] = useState(
    editStaff?.isActive ?? false,
  );
  const [date, setDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // console.log(selectedActive);

  useEffect(() => {
    if (editStaff) {
      setValue("session", editStaff.session);
      setValue("startDate", editStaff.startDate);
      setValue("endDate", editStaff.endDate);
      setValue("isActive", editStaff.isActive);
      setDate(new Date(editStaff.startDate));
      setEndDate(new Date(editStaff.endDate));
    }
  }, [editStaff]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SessionType>();

  const handleClose = () => {
    onClose();
    setValue("session", "");
    setValue("startDate", new Date()?.toDateString());
    setValue("endDate", new Date()?.toDateString());
    setValue("isActive", false);
    setDate(null);
    setEndDate(null);
  };

  const onSubmit = async (data: SessionType) => {
    setMutating(true);
    toast.loading(isEdit ? "Updating Session..." : "Adding Session...");
    try {
      const staffData = {
        ...data,
        session: `${date?.getFullYear()}/${endDate?.getFullYear()}`,
        isActive: selectedActive,
        startDate: date?.toDateString() as string,
        endDate: endDate?.toDateString() as string,
      };
      isEdit
        ? await updateSession(editStaff?._id!, staffData)
        : await addNewSession(staffData);
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
      title={isEdit ? "Edit Session" : "New Session"}
      description={
        isEdit ? "Edit Session details" : "Enter new Session details"
      }
    >
      <div className="flex flex-col gap-3 overflow-y-auto">
        <p className="text-sm font-black">
          Session will be autofilled based on the start and end dates{" "}
        </p>
        {/*<InputContainer label="Session">
          <div className="w-full input flex items-center justify-between bg-gray-100">
            <input
              type="text"
              className="w-full iput  cursor-not-allowed"
              placeholder="Auto-filled by selected Start and End year"
              {...register("session", {
                required: "Session is required",
              })}
              disabled={true}
            />
          </div>
          {errors.session && (
            <ErrorText error={errors.session.message?.toString() ?? ""} />
          )}
        </InputContainer>*/}
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
            label="Start Date"
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

        {/*<InputContainer label="Active">
          <SearchableNativeSelect
            options={[
              { value: "true", label: "Yes" },
              { value: "false", label: "No" },
            ]}
            value={selectedActive ? "true" : "false"}
            onChange={(value) => setSelectedActive(value === "true")}
            placeholder="Select staff active status"
          />
        </InputContainer>*/}

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

export default SessionModal;
