"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";

import { Box } from "../students/single-student";
import { Cols, Row } from "../ui/reusables/cols-rows";
import { TableOverflow } from "../ui/reusables/table";
import InputContainer from "../ui/reusables/input-container";
import SearchableNativeSelect from "../ui/reusables/select";

import { useClassSubjects } from "@/hooks/useSubjectClasses";
import { useSession } from "@/hooks/useSession";
import { useTerms } from "@/hooks/useTerms";
import { useStudentsTermResults } from "@/hooks/useStudentTermResults";

import type {
  LevelType,
  ResultType,
  SessionType,
  TermType,
} from "@/utils/types";
import { CustomButton } from "../ui/reusables/custom-btn";
import toast from "react-hot-toast";
import { toApiError } from "@/utils/api-error";
import { computeTermResults } from "@/lib/api/endpoints/results";
import { toOrdinal } from "@/lib/helpers/helper";
import { useStudentRatings } from "@/hooks/useStudentRatings";
import RateStudent from "./ratings";
import SectionSkeleton from "../ui/reusables/section-loader";
import Empty from "../ui/reusables/empty";

const gridHeads = [
  "Subject",
  "CA1",
  "CA2",
  "Exam",
  "Total",
  "Class average",
  "Grade",
  "POS",
  "Remark",
];

const isBrowser = typeof window !== "undefined";

// Draft is keyed by ClassSubject._id (mapping doc id), but stores Subject._id for payload
type DraftMark = {
  classSubjectId: string; // mapping id (row id)
  subjectId: string; // REAL Subject._id (what Result schema expects)
  ca1: number | "";
  ca2: number | "";
  exam: number | "";
  remark: string;
};

const clampNum = (raw: string): number | "" => {
  if (raw === "") return "";
  const n = Number(raw);
  return Number.isFinite(n) ? n : "";
};

const ResultCompute = ({
  classId,
  level,
}: {
  classId: string;
  level: LevelType;
}) => {
  const { studentsId } = useParams<{ studentsId: string }>();

  const [isLoading, setIsLoading] = useState(false);
  const [draftMarks, setDraftMarks] = useState<Record<string, DraftMark>>({});

  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const qpSessionId = sp.get("sessionId") ?? "";
  const qpTermId = sp.get("termId") ?? "";

  const storedSessionId = isBrowser
    ? (sessionStorage.getItem("sessionId") ?? "")
    : "";

  const [selectedSession, setSelectedSession] = useState<string>(
    qpSessionId || storedSessionId || "",
  );
  const [selectedTerm, setSelectedTerm] = useState<string>(qpTermId || "");

  useEffect(() => {
    if (qpSessionId && qpSessionId !== selectedSession)
      setSelectedSession(qpSessionId);
    if (qpTermId && qpTermId !== selectedTerm) setSelectedTerm(qpTermId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qpSessionId, qpTermId]);

  const updateQueryParams = (name: string, id: string) => {
    const next = new URLSearchParams(sp.toString());
    if (!id) next.delete(name);
    else next.set(name, id);

    router.push(`${pathname}?${next.toString()}`);
  };

  // --- fetch class subjects
  const { classSubjectsData, isLoadingClassSubjects } =
    useClassSubjects(classId);

  // --- fetch sessions
  const { sessionData, isLoadingSession } = useSession();
  const sessions: SessionType[] = sessionData?.data?.sessions ?? [];

  const activeSessionId = useMemo(() => {
    const active = sessions.find((s) => s.isActive);
    return active?._id ?? "";
  }, [sessions]);

  useEffect(() => {
    if (!sessions.length) return;
    if (selectedSession) return;

    if (activeSessionId) {
      setSelectedSession(activeSessionId);
      updateQueryParams("sessionId", activeSessionId);
      if (isBrowser) sessionStorage.setItem("sessionId", activeSessionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, activeSessionId]);

  // --- fetch terms
  const { termsData, isLoadingTerm } = useTerms(selectedSession);
  const terms: TermType[] = termsData?.data?.terms ?? [];
  // console.log(termsData);SectionSkeleton /

  useEffect(() => {
    if (!selectedSession) return;
    if (!terms.length) return;
    if (selectedTerm) return;

    const active = terms.find((t) => t.isActive);
    const fallback = active?._id ?? terms[0]?._id ?? "";

    if (fallback) {
      setSelectedTerm(fallback);
      updateQueryParams("termId", fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSession, terms]);

  // ---- results
  const { resultsData, isLoadingResultsData, refetchResultsData } =
    useStudentsTermResults({
      tmId: selectedTerm,
      classId,
      studId: studentsId,
    });

  const subjects = classSubjectsData?.data?.classSubjects ?? [];

  const { studentsRatingData, isLoadingStudentRating, refetchStudentsRating } =
    useStudentRatings({
      trmId: selectedTerm,
      clId: classId,
      stdId: studentsId,
      sesId: selectedSession,
    });

  // console.log("students Ratings", activeSessionId);

  const rateItems = studentsRatingData?.data?.ratings;

  const affectiveness = rateItems?.filter(
    (itm: any) => itm.category === "Affective",
  );
  const behavioural = rateItems?.filter(
    (itm: any) => itm.category === "Behaviour",
  );
  const psychomotor = rateItems?.filter(
    (itm: any) => itm.category === "Psychomotor",
  );
  const Nursery = rateItems?.filter((itm: any) => itm.category === "Nursery");
  const Basic = rateItems?.filter((itm: any) => itm.category === "Basic");

  // Build map of existing results keyed by REAL subjectId
  const existingMap = useMemo(() => {
    const list = resultsData?.data?.results ?? [];
    const m = new Map<string, ResultType>();
    for (const r of list) {
      const sid = String((r as any).subjectId?._id ?? (r as any).subjectId);
      m.set(sid, r);
    }
    return m;
  }, [resultsData]);

  // Update local draft for a row (keyed by classSubjectId, stores real subjectId)
  const upsertMark = (
    classSubjectId: string,
    subjectId: string,
    field: "ca1" | "ca2" | "exam" | "remark",
    raw: string,
  ) => {
    setDraftMarks((prev) => {
      const base: DraftMark =
        prev[classSubjectId] ??
        ({
          classSubjectId,
          subjectId,
          ca1: "",
          ca2: "",
          exam: "",
          remark: "",
        } as DraftMark);

      if (field === "remark") {
        return {
          ...prev,
          [classSubjectId]: {
            ...base,
            subjectId, // keep synced
            remark: raw,
          },
        };
      }

      const val = clampNum(raw);

      return {
        ...prev,
        [classSubjectId]: {
          ...base,
          subjectId, // keep synced
          [field]: val,
        },
      };
    });
  };

  const arr = useMemo(() => Object.values(draftMarks), [draftMarks]);

  const handleComputeResult = async () => {
    if (!arr.length) return;

    // Validation (IMPORTANT: 0 is allowed; only "" is invalid)
    for (let i = 0; i < arr.length; i++) {
      const r = arr[i];

      if (r.ca1 === "" || r.ca2 === "" || r.exam === "") {
        toast.error("CA1, CA2 and Exam fields are required");
        return;
      }

      if (Number(r.ca1) > 20 || Number(r.ca2) > 20) {
        toast.error("CA1 and CA2 scores must not be greater than 20");
        return;
      }

      if (Number(r.exam) > 60) {
        toast.error("Exam score must not be greater than 60");
        return;
      }
    }

    // Payload uses REAL subjectId
    const results = arr.map((r) => ({
      ca1: Number(r.ca1),
      ca2: Number(r.ca2),
      exam: Number(r.exam),
      remark: String(r.remark ?? ""),
      subjectId: String(r.subjectId),
    }));

    toast.loading("Computing results.....");
    setIsLoading(true);

    try {
      await computeTermResults({
        termId: selectedTerm,
        classId,
        studentId: studentsId,
        results: { results },
      });

      await refetchResultsData();
      toast.remove();
      toast.success("Results computed successfully");

      setDraftMarks({});
    } catch (error: unknown) {
      const { message } = toApiError(error);
      toast.remove();
      toast.error(message || "failed to compute result");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // ---- Loading states
  if (
    isLoadingSession ||
    isLoadingStudentRating ||
    isLoadingTerm ||
    isLoadingClassSubjects ||
    isLoadingResultsData
  )
    return (
      <div>
        <SectionSkeleton />
      </div>
    );

  if (!selectedSession)
    return (
      <div>
        <SectionSkeleton />
      </div>
    );

  if (!terms.length)
    return (
      <div>
        <SectionSkeleton />
      </div>
    );
  if (!selectedTerm)
    return (
      <div>
        <SectionSkeleton />
      </div>
    );

  // console.log(resultsData);

  return (
    <Cols className="gap-3 ">
      <Box className="">
        <Row className="flex-col! lg:justify-between lg:flex-row! gap-3">
          <Cols className="gap-1">
            <h1 className="font-black text-xl">Compute student's result</h1>
            <p className="text-sm">
              Fill the CA and exam fields , all the other fields will be
              auto-calculated and returned
            </p>
          </Cols>

          <Row className="gap-3 ">
            <Row className="gap-2">
              <p className="font-bold">Session</p>
              <InputContainer className="max-w-56">
                <SearchableNativeSelect
                  options={sessions.map((s) => ({
                    value: s._id!,
                    label: `${s.session} ${s.isActive ? "(Current session)" : ""}`,
                  }))}
                  value={selectedSession}
                  onChange={(value) => {
                    setSelectedSession(value);
                    setSelectedTerm("");
                    updateQueryParams("sessionId", value);
                    updateQueryParams("termId", "");
                    if (isBrowser) sessionStorage.setItem("sessionId", value);
                  }}
                  placeholder="Select Session"
                />
              </InputContainer>
            </Row>

            <Row className="gap-2">
              <p className="font-bold">Term</p>
              <InputContainer className="max-w-56">
                <SearchableNativeSelect
                  options={terms.map((t) => ({
                    value: t._id!,
                    label: `${t.term} ${t.isActive ? "(Current term)" : ""}`,
                  }))}
                  value={selectedTerm}
                  onChange={(value) => {
                    setSelectedTerm(value);
                    updateQueryParams("termId", value);
                  }}
                  placeholder="Select Term"
                />
              </InputContainer>
            </Row>
          </Row>
        </Row>

        <TableOverflow className="h-full w-full ">
          {arr.length > 0 && (
            <div className="max-w-50 mb-4 ">
              <CustomButton onClick={handleComputeResult} disabled={isLoading}>
                {isLoading ? "Computing Score...." : "Compute"}
              </CustomButton>
            </div>
          )}

          {!subjects?.length ? (
            <Empty
              title="No Subjects"
              description="No subjects has been registered under this class yet"
            />
          ) : (
            <div className="min-w-250! ">
              <div className="grid grid-cols-[1fr_80px_80px_80px_80px_150px_80px_80px_0.8fr] border border-gray-200 gap-0 rounded">
                {gridHeads.map((head) => (
                  <div
                    key={head}
                    className="border py-1 px-2 border-gray-400 font-bold "
                  >
                    {head}
                  </div>
                ))}
              </div>

              <div>
                {subjects.map((s: any) => {
                  const classSubjectId = String(s._id); // mapping id (row key)
                  const subjectId = String(s.subjectId?._id ?? s.subjectId); // REAL Subject._id

                  const existing = existingMap.get(subjectId);
                  const draft = draftMarks[classSubjectId];

                  return (
                    <div
                      key={classSubjectId}
                      className="grid grid-cols-[1fr_80px_80px_80px_80px_150px_80px_80px_0.8fr]  border border-gray-200 gap-0 rounded"
                    >
                      <div className="p-2 border border-gray-400">
                        {s.subjectId?.name ?? s.name ?? "Subject"}
                      </div>

                      <div className="text-center border border-gray-400">
                        <input
                          type="number"
                          className="iput p-2"
                          placeholder="CA1"
                          value={draft?.ca1 ?? existing?.ca1 ?? ""}
                          onChange={(e) =>
                            upsertMark(
                              classSubjectId,
                              subjectId,
                              "ca1",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="text-center border border-gray-400">
                        <input
                          type="number"
                          className="iput p-2"
                          placeholder="CA2"
                          value={draft?.ca2 ?? existing?.ca2 ?? ""}
                          onChange={(e) =>
                            upsertMark(
                              classSubjectId,
                              subjectId,
                              "ca2",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="text-center border border-gray-400">
                        <input
                          type="number"
                          className="iput p-2"
                          placeholder="Exam"
                          value={draft?.exam ?? existing?.exam ?? ""}
                          onChange={(e) =>
                            upsertMark(
                              classSubjectId,
                              subjectId,
                              "exam",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="p-2 text-center border border-gray-400">
                        {existing?.total ?? "-"}
                      </div>
                      <div className="p-2 text-center border border-gray-400">
                        {(existing as any)?.classAverage ?? "-"}
                      </div>
                      <div className="p-2 text-center border border-gray-400">
                        {existing?.grade ?? "-"}
                      </div>
                      <div className="p-2 text-center border border-gray-400">
                        {toOrdinal((existing as any)?.pos) ?? "-"}
                      </div>

                      <div className="border border-gray-400">
                        <input
                          type="text"
                          className="iput p-2"
                          placeholder="Remark"
                          value={draft?.remark ?? existing?.remark ?? ""}
                          onChange={(e) =>
                            upsertMark(
                              classSubjectId,
                              subjectId,
                              "remark",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <RateStudent
            affectiveness={affectiveness}
            behavioural={behavioural}
            psychomotor={psychomotor}
            refetch={refetchStudentsRating}
            termId={selectedTerm}
            sessionId={selectedSession}
            classId={classId}
            studentId={studentsId}
            summary={studentsRatingData?.data?.summary}
            level={level}
            Nursery={Nursery}
            Basic={Basic}
          />
        </TableOverflow>
      </Box>
    </Cols>
  );
};

export default ResultCompute;
