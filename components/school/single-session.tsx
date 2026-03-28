"use client";
import AdminDashboardSkeleton from "@/app/loading";
import { useSingleSession } from "@/hooks/useSession";
import { useParams } from "next/navigation";
import { BoxItemRow, Box, BackBtn } from "../students/single-student";
import { Cols, Row } from "../ui/reusables/cols-rows";
import { SessionType } from "@/utils/types";
import { formatDate } from "@/lib/helpers/helper";
import { useState } from "react";
import Modal from "../ui/modal";
import { toApiError } from "@/utils/api-error";
import toast from "react-hot-toast";
import { activateSession } from "@/lib/api/endpoints/school";
import { CustomButton } from "../ui/reusables/custom-btn";
import SessionTerms from "./session-terms";

const SingleSession = () => {
  const { sessionId } = useParams();

  const { sessionData, isLoadingSession, refetchSession } = useSingleSession();
  const [isActivating, setIsActivating] = useState(false);
  const [open, setOpen] = useState(false);

  if (isLoadingSession) return <AdminDashboardSkeleton />;
  // if (!sessionData) return <div>No session found</div>;

  const session: SessionType = sessionData?.data?.session;

  const handleStatusChange = () => {
    setOpen(true);
  };
  // console.log(session);

  const handleActivate = async () => {
    toast.loading("Activating session...");
    setIsActivating(true);
    try {
      await activateSession(sessionId as string);
      await refetchSession();
      toast.remove();
      toast.success("Session activated successfully");

      setOpen(false);
    } catch (error: unknown) {
      const { message } = toApiError(error);

      toast.remove();
      toast.error(message ?? "Failed to activate session");

      console.error(error);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-6">
      <div className="fixed top-0 left-0 right-0 my-8">
        <div className="w-28">
          <BackBtn />
        </div>
      </div>
      <Cols className="gap-4 mt-8">
        <h1 className="font-black text-xl">Session Details</h1>
        <Box className="min-h-50!">
          <BoxItemRow title="Session" answer={session?.session} />
          <BoxItemRow
            title="Start Date"
            answer={formatDate(session?.startDate)}
          />
          <BoxItemRow title="End Date" answer={formatDate(session?.endDate)} />
          <BoxItemRow
            title="Status"
            answer={
              <ActiveBadge status={session?.isActive ? "Active" : "Inactive"} />
            }
          />
          {session?.isActive ? null : (
            <BoxItemRow
              title="Activate Session"
              answer={
                <ToggleBtn
                  firstLabel="Inactive"
                  lastLabel="Active"
                  disabled={session?.isActive}
                  selected={session?.isActive ? "Active" : "Inactive"}
                  onSelect={handleStatusChange}
                />
              }
            />
          )}
        </Box>
      </Cols>

      <SessionTerms session={session} />

      <Modal open={open} onClose={() => setOpen(false)}>
        <Cols className="gap-3">
          <h2 className="font-black text-xl">Activate Session</h2>
          <p className="text-gray-500">
            Activating this session, will deactivate and end the previous
            session. Are sure?
          </p>
          <Row className="gap-2 italic justify-between">
            <CustomButton
              onClick={() => setOpen(false)}
              variant="secondary"
              disabled={isActivating}
            >
              Cancel
            </CustomButton>
            <CustomButton onClick={handleActivate} disabled={isActivating}>
              {isActivating ? "Activating..." : "Activate"}
            </CustomButton>
          </Row>
        </Cols>
      </Modal>
    </div>
  );
};

export default SingleSession;

export const ToggleBtn = ({
  firstLabel,
  lastLabel,
  disabled,
  selected,
  onSelect,
}: {
  firstLabel: string;
  lastLabel: string;
  disabled: boolean;
  selected: string;
  onSelect: () => void;
}) => {
  const isFirstLabel = selected === firstLabel;
  return (
    <Row className={`items-center gap-1`}>
      <p className={isFirstLabel ? "text-black" : "text-gray-500"}>
        {firstLabel}
      </p>
      <button
        disabled={disabled}
        className={`h-4 w-7 flex items-center rounded-full bg-black cursor-pointer`}
        onClick={onSelect}
      >
        <div
          className={`w-3 h-3 rounded-full bg-gray-100 ${selected === firstLabel ? "translate-x-0.5" : "translate-x-3"} `}
        />
      </button>
      <p className={isFirstLabel ? "text-gray-500" : "text-black"}>
        {lastLabel}
      </p>
    </Row>
  );
};

export const ActiveBadge = ({ status }: { status: "Active" | "Inactive" }) => {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${status === "Active" ? "bg-green-100 text-green-500  border-green-500" : "bg-red-100 text-red-500  border-red-500"}`}
    >
      {status}
    </span>
  );
};
