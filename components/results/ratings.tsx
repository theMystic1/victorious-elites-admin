"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Cols, Row } from "../ui/reusables/cols-rows";
import { rateStudent } from "@/lib/api/endpoints/ratings";

type RateItem = {
  category: string;
  item: string;
  rating: number | null;
  ratingItemId: string;
};

type DraftRating = {
  ratingItemId: string;
  rating: number | ""; // allow empty while typing
};

const clampRating = (raw: string): number | "" => {
  if (raw === "") return "";
  const n = Number(raw);
  if (!Number.isFinite(n)) return "";
  return n;
};

const RateStudent = ({
  affectiveness,
  behavioural,
  psychomotor,
  refetch,
  termId,
  sessionId,
  classId,
  studentId,
  summary,
}: {
  affectiveness: RateItem[];
  psychomotor: RateItem[];
  behavioural: RateItem[];
  refetch: () => void;

  termId: string;
  sessionId: string;
  classId: string;
  studentId: string;

  summary: {
    formTeacherRemark: string;
    principalsRemark: string;
    signedBy: string;
    signedDate: string;
  };
}) => {
  // Create a single list for initialization
  const allItems = useMemo(
    () => [...affectiveness, ...behavioural, ...psychomotor],
    [affectiveness, behavioural, psychomotor],
  );

  // Draft state keyed by ratingItemId
  const [draft, setDraft] = useState<Record<string, DraftRating>>(() => {
    const init: Record<string, DraftRating> = {};
    for (const it of allItems) {
      init[it.ratingItemId] = {
        ratingItemId: it.ratingItemId,
        rating: it.rating ?? "",
      };
    }
    return init;
  });
  const { formTeacherRemark, principalsRemark } = summary;
  const [remarks, setRemarks] = useState({
    formTeacherRemark: formTeacherRemark || "",
    principalsRemark: principalsRemark || "",
  });

  // If props change (refetch brings ratings), you may want to sync draft:
  // - only do it when you want to overwrite current typing
  // For now: keep simple and don't auto-overwrite user input.

  const setRating = (ratingItemId: string, raw: string) => {
    const val = clampRating(raw);
    setDraft((prev) => ({
      ...prev,
      [ratingItemId]: {
        ratingItemId,
        rating: val,
      },
    }));
  };

  const validate = () => {
    for (const r of Object.values(draft)) {
      if (r.rating === "") continue; // allow unrated
      if (r.rating < 1 || r.rating > 5)
        return "Ratings must be between 1 and 5.";
    }
    return null;
  };

  const onSave = async () => {
    const err = validate();
    if (err) return toast.error(err);

    // Only send rows that have a value (optional)
    const ratings = Object.values(draft)
      .filter((r) => r.rating !== "")
      .map((r) => ({
        ratingItemId: r.ratingItemId,
        rating: Number(r.rating),
      }));

    if (!ratings.length)
      return toast.error("Enter at least one rating to save.");

    const { formTeacherRemark, principalsRemark } = remarks;

    if (!formTeacherRemark || !principalsRemark)
      return toast.error(
        "Both principal's and formTeacher remarks are important and required",
      );
    toast.loading("Saving ratings...");
    try {
      await rateStudent({
        sessionId,
        studentId,
        classId,
        termId,
        ratings,
        formTeacherRemark,
        principalsRemark,
      });

      await refetch();
      toast.dismiss();
      toast.success("Ratings saved");
    } catch (e: any) {
      toast.dismiss();
      toast.error(
        e?.response?.data?.message ?? e?.message ?? "Failed to save ratings",
      );
    }
  };

  // console.log("summary", summary);

  const renderColumn = (title: string, items: RateItem[]) => (
    <Cols>
      <h1 className="font-black text-xl">{title}</h1>

      {items?.map((it) => {
        const value = draft[it.ratingItemId]?.rating ?? it.rating ?? "";
        return (
          <Row
            key={it.ratingItemId}
            className="border border-gray-300 items-center"
          >
            <span className="border border-gray-300 min-w-50 w-full font-bold p-1">
              {it.item}
            </span>

            <div className="text-center border border-gray-400 p-1">
              <input
                className="iput w-16 text-center"
                type="number"
                min={1}
                max={5}
                placeholder="1-5"
                value={value === null ? "" : value}
                onChange={(e) => setRating(it.ratingItemId, e.target.value)}
              />
            </div>
          </Row>
        );
      })}
    </Cols>
  );

  return (
    <Cols className="gap-5 mt-8">
      <Row className="items-center justify-between">
        <Cols>
          <h1 className="font-black text-2xl">Students Attitude score</h1>
          <p>Fill out each score</p>
        </Cols>
      </Row>

      <div className="grid grid-cols-3 gap-3">
        {renderColumn("Affectiveness", affectiveness)}
        {renderColumn("Behavioural", behavioural)}
        {renderColumn("Psychomotor", psychomotor)}
      </div>

      <Cols className="gap-3">
        <h2 className="text-xl font-black">Teacher's / Principal's Remark</h2>

        <Row className="w-full items-baseline! gap-2">
          <h3 className="font-bold uppercase text-sm w-50">
            Form teacher's remark
          </h3>

          <div className="border border-gray-300 p-1 rounded-lg lg:min-w-100">
            <input
              type="text"
              className="iput"
              placeholder="Enter form teacher's remark"
              value={remarks?.formTeacherRemark}
              onChange={(e) =>
                setRemarks((re) => ({
                  ...re,
                  formTeacherRemark: e.target.value,
                }))
              }
            />
          </div>
        </Row>
        <Row className="w-full items-baseline! gap-2">
          <h3 className="font-bold uppercase text-sm w-50">
            principal's remark
          </h3>

          <div className="border border-gray-300 p-1 rounded-lg lg:min-w-100">
            <input
              type="text"
              className="iput"
              placeholder="Enter principal's remark"
              value={remarks?.principalsRemark}
              onChange={(e) =>
                setRemarks((re) => ({
                  ...re,
                  principalsRemark: e.target.value,
                }))
              }
            />
          </div>
        </Row>

        <div className="max-w-40">
          <button className="btn btn-primary" onClick={onSave}>
            Save Ratings
          </button>
        </div>
      </Cols>
    </Cols>
  );
};

export default RateStudent;
