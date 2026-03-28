"use client";

import StudentsTable from "../students/students-table";
import ResultsTable from "./results-table";

import { useClasses } from "@/hooks/useClasses";
import { useClassResults } from "@/hooks/useClassResults";
import { useSession } from "@/hooks/useSession";
import { useTerms } from "@/hooks/useTerms";
import type { ClassType, SessionType, TermType } from "@/utils/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { Cols } from "../ui/reusables/cols-rows";
import AdminDashboardSkeleton from "@/app/loading";

const Results = () => {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  // query params
  const qpSessionId = sp.get("sessionId") ?? "";
  const qpTermId = sp.get("termId") ?? "";
  const qpClassId = sp.get("classId") ?? "";

  // local state (source of truth: URL if present, else defaults)
  const [selectedSession, setSelectedSession] = useState<string>(qpSessionId);
  const [selectedTerm, setSelectedTerm] = useState<string>(qpTermId);
  const [selectedClassId, setSelectedClassId] = useState<string>(qpClassId);

  // keep state in sync with URL
  useEffect(() => {
    if (qpSessionId && qpSessionId !== selectedSession)
      setSelectedSession(qpSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qpSessionId]);

  useEffect(() => {
    if (qpTermId && qpTermId !== selectedTerm) setSelectedTerm(qpTermId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qpTermId]);

  useEffect(() => {
    if (qpClassId && qpClassId !== selectedClassId)
      setSelectedClassId(qpClassId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qpClassId]);

  const updateQueryParams = (name: string, id: string) => {
    const next = new URLSearchParams(sp.toString());
    if (!id) next.delete(name);
    else next.set(name, id);
    router.push(`${pathname}?${next.toString()}`);
  };

  // fetch sessions + classes
  const { sessionData, isLoadingSession } = useSession();
  const { classesData, isLoadingClasses } = useClasses();

  const sessions: SessionType[] = sessionData?.data?.sessions ?? [];
  const fetchedClasses: ClassType[] = classesData?.data?.classes ?? [];

  // active session id
  const activeSessionId = useMemo(() => {
    const active = sessions.find((s) => s.isActive);
    return active?._id ?? "";
  }, [sessions]);

  // Default session on load (only if not already set)
  useEffect(() => {
    if (!sessions.length) return;
    if (selectedSession) return; // already chosen (URL or prior state)

    const fallback = activeSessionId || sessions[0]?._id || "";
    if (!fallback) return;

    setSelectedSession(fallback);
    updateQueryParams("sessionId", fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, activeSessionId, selectedSession]);

  // fetch terms only when session exists
  const { termsData, isLoadingTerm } = useTerms(selectedSession);
  const terms: TermType[] = termsData?.data?.terms ?? [];

  // active term id
  const activeTermId = useMemo(() => {
    const active = terms.find((t) => t.isActive);
    return active?._id ?? "";
  }, [terms]);

  // Default term on load (only if not already set)
  useEffect(() => {
    if (!selectedSession) return;
    if (!terms.length) return;
    if (selectedTerm) return;

    const fallback = activeTermId || terms[0]?._id || "";
    if (!fallback) return;

    setSelectedTerm(fallback);
    updateQueryParams("termId", fallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession, terms, activeTermId, selectedTerm]);

  // Default classId on load (first class) only if not already set
  useEffect(() => {
    if (!fetchedClasses.length) return;
    if (selectedClassId) return;

    const first = fetchedClasses[0]?._id ?? "";
    if (!first) return;

    setSelectedClassId(first);
    updateQueryParams("classId", first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedClasses, selectedClassId]);

  // Now fetch class results only when termId + classId exist
  const { resulttClassesData, isLoadingResultClasses, refetchResultClasses } =
    useClassResults({
      termId: selectedTerm,
      classId: selectedClassId,
    });

  console.log(resulttClassesData);

  // Loading states
  if (isLoadingSession)
    return (
      <div>
        <p>Loading sessions...</p>
      </div>
    );
  if (isLoadingClasses)
    return (
      <div>
        <p>Loading classes...</p>
      </div>
    );

  if (!sessions.length) return <div>No sessions found.</div>;
  if (!fetchedClasses.length) return <div>No classes found.</div>;

  if (!selectedSession)
    return (
      <div>
        <p>Selecting active session...</p>
      </div>
    );
  if (isLoadingTerm)
    return (
      <div>
        <p>Loading terms...</p>
      </div>
    );
  if (!terms.length)
    return (
      <div>
        <p>No terms found for this session.</p>
      </div>
    );
  if (!selectedTerm)
    return (
      <div>
        <p>Selecting active term...</p>
      </div>
    );
  if (!selectedClassId)
    return (
      <div>
        <p>Selecting default class...</p>
      </div>
    );

  if (isLoadingResultClasses) return <AdminDashboardSkeleton />;

  const leaderBoard = resulttClassesData?.data?.leaderboard;

  return (
    <main>
      <ResultsTable
        fetchedClasses={fetchedClasses}
        leaderBoard={leaderBoard}
        setSelectedClassId={setSelectedClassId}
        setSelectedSessionId={setSelectedSession}
        setSelectedClassTermId={setSelectedTerm}
        selectedClassId={selectedClassId}
        selectedSessionId={selectedSession}
        selectedTermId={selectedTerm}
        updateQueryParams={updateQueryParams}
      />
    </main>
  );
};

export default Results;
