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

type GenderType = "MALE" | "FEMALE";

const StaffsModal = ({
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
  editStaff?: METype;
}) => {
  const [selectedRole, setSelectedRole] = useState<USERROLE>(
    editStaff?.role ?? "STAFF",
  );
  const [mutating, setMutating] = useState(false);
  const [selectedActive, setSelectedActive] = useState(
    editStaff?.isActive ?? false,
  );

  // console.log(selectedActive);

  useEffect(() => {
    if (editStaff) {
      setSelectedRole(editStaff.role as USERROLE);
      setValue("firstName", editStaff.firstName);
      setValue("lastName", editStaff.lastName);
      setValue("phoneNumber", editStaff.phoneNumber);
      setValue("email", editStaff.email);
      setValue("role", editStaff.role);
      setValue("isActive", editStaff.isActive);
    }
  }, [editStaff]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<METype>();

  const handleClose = () => {
    onClose();
    setSelectedRole("STAFF");
    setValue("firstName", "");
    setValue("lastName", "");
    setValue("phoneNumber", "");
    setValue("email", "");
    setValue("role", "STAFF");
    setValue("isActive", false);
  };

  const onSubmit = async (data: METype) => {
    setMutating(true);
    toast.loading("Adding Staff...");
    try {
      const staffData = {
        ...data,
        isActive: selectedActive,
        role: selectedRole?.toUpperCase() as USERROLE,
      };
      const staff =
        isEdit && editStaff
          ? await updateStaff(editStaff._id!, staffData)
          : await addStaff(staffData);
      refetchStaff();
      handleClose();
      toast.remove();
      toast.success(
        isEdit ? "Staff updated successfully" : "Staff created successfully",
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
      title={isEdit ? "Edit staff" : "New staff"}
      description={isEdit ? "Edit staff details" : "Enter new staff details"}
    >
      <div className="flex flex-col gap-3 overflow-y-auto">
        <InputContainer label="First Name">
          <div className="w-full input flex items-center justify-between">
            <input
              type="text"
              className="w-full iput"
              placeholder="Enter staff first name"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
          </div>
          {errors.firstName && (
            <ErrorText error={errors.firstName.message?.toString() ?? ""} />
          )}
        </InputContainer>
        <InputContainer label="Last Name">
          <div className="w-full input flex items-center justify-between">
            <input
              type="text"
              className="w-full iput"
              placeholder="Enter staff last name"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
          </div>
          {errors.lastName && (
            <ErrorText error={errors.lastName.message?.toString() ?? ""} />
          )}
        </InputContainer>
        <InputContainer label="Email">
          <div className="w-full input flex items-center justify-between bg-gray-100">
            <input
              type="text"
              className="w-full iput "
              placeholder="Enter staff email"
              {...register("email", {
                required: "Email is required",
              })}
              disabled={isEdit}
            />
          </div>
          {errors.email && (
            <ErrorText error={errors.email.message?.toString() ?? ""} />
          )}
        </InputContainer>
        <InputContainer label="Phone Number">
          <div className="w-full input flex items-center justify-between">
            <input
              type="text"
              className="w-full iput"
              placeholder="Enter staff phone number"
              {...register("phoneNumber", {
                required: "Phone number is required",
              })}
            />
          </div>
          {errors.phoneNumber && (
            <ErrorText error={errors.phoneNumber.message?.toString() ?? ""} />
          )}
        </InputContainer>

        <InputContainer label="Role">
          <SearchableNativeSelect
            options={[
              { value: "STAFF", label: "Staff" },
              { value: "ADMIN", label: "Admin" },
              { value: "PRINCIPAL", label: "Principal" },
            ]}
            value={selectedRole!}
            onChange={(value) => setSelectedRole(value as any)}
            placeholder="Select staff role"
          />
        </InputContainer>

        {isEdit ? (
          <InputContainer label="Active">
            <SearchableNativeSelect
              options={[
                { value: "true", label: "Yes" },
                { value: "false", label: "No" },
              ]}
              value={selectedActive === true ? "Yes" : "No"}
              onChange={(value) =>
                setSelectedActive(value === "true" ? true : false)
              }
              placeholder="Select staff active status"
            />
          </InputContainer>
        ) : null}

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

export default StaffsModal;
