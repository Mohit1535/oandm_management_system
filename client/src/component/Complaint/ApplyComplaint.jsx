import React, { useEffect, useState } from "react";
import {
  X,
  Send,
  FileText,
  CalendarDays,
  Building2,
  MapPin,
  ClipboardCheck,
  UploadCloud,
  Paperclip,
  AlertCircle,
  MessageSquareText,
} from "lucide-react";

import { branchName, Sites } from "../../assets";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Loading from "../Loading";

// Change this import path if your Axios instance is stored elsewhere.
import api from "../../api/axios";

const ApplyComplaint = ({

  onClose,
  onSuccess,
  open = true,
  initialData = null,
  OnEdit
}) => {
  // =========================
  // EDIT MODE
  // =========================

  const isEditMode = Boolean(initialData);

  // =========================
  // STATES
  // =========================
  const [employees,setEmployees]=useState(null)
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    assetsName: "",
    complaintDate: "",
    sites: [],
    branchName: [],
  });

useEffect(() => {
  const fetchEmployee = async () => {
    try {
      const res = await api.get("/employees/me");

      const employeeData = res.data?.employee;

      if (!employeeData) {
        throw new Error(
          "Employee details were not returned by the server."
        );
      }

      setEmployees(employeeData);
    } catch (error) {
      console.error(
        "Error fetching employee details:",
        error.response?.data || error.message
      );

      setEmployees(null);
    } finally {
      setLoading(false);
    }
  };

  fetchEmployee();
}, []);

 const assignedSites = Array.isArray(employees?.sites)
  ? employees.sites
  : employees?.sites
    ? [employees.sites]
    : [];

const assignedBranch = Array.isArray(employees?.branchName)
  ? employees.branchName
  : employees?.branchName
    ? [employees.branchName]
    : [];

  const [attachedDocument,setAttachedDocument]=useState("");
  // =========================
  // INITIAL VALUES
  // =========================

  useEffect(() => {
    if (!initialData) {
      setFormValues({
        assetsName: "",
        complaintDate: "",
        sites: [],
        branchName: [],
      });

      setDescription("");
      setSelectedFile(null);
      setFormError("");

      return;
    }

    setFormValues({
      assetsName: initialData.assetsName || "",
      complaintDate: initialData.complaintDate
        ? String(initialData.complaintDate).slice(0, 10)
        : "",
      sites: Array.isArray(initialData.sites)
        ? initialData.sites
        : initialData.sites
          ? [initialData.sites]
          : [],
      branchName: Array.isArray(initialData.branchName)
        ? initialData.branchName
        : initialData.branchName
          ? [initialData.branchName]
          : [],
    });

    setDescription(initialData.description || "");
    setSelectedFile(null);
    setFormError("");
  }, [initialData]);

  // =========================
  // TODAY'S DATE
  // =========================

  const today = new Date();

  today.setMinutes(
    today.getMinutes() - today.getTimezoneOffset()
  );

  const todayDate = today.toISOString().split("T")[0];

  // =========================
  // SAFE SITE ARRAY
  // =========================

  const siteOptions = Array.isArray(Sites) ? Sites : [];

  // =========================
  // SAFE BRANCH ARRAY
  // =========================

  const branchOptions = Array.isArray(branchName)
    ? branchName
    : [];

  // =========================
  // GET SITE VALUE
  // =========================

  const getSiteValue = (site) => {
    if (typeof site === "string") {
      return site;
    }

    if (site && typeof site === "object") {
      return site.sites || "";
    }

    return "";
  };

  // =========================
  // GET BRANCH VALUE
  // =========================

  const getBranchValue = (branch) => {
    if (typeof branch === "string") {
      return branch;
    }

    if (branch && typeof branch === "object") {
      return branch.branchName || branch.name || "";
    }

    return "";
  };

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));

    setFormError("");
  };

  // =========================
  // HANDLE DESCRIPTION
  // =========================

  const handleDescriptionChange = (value) => {
    setDescription(value);
    setFormError("");
  };

  // =========================
  // HANDLE FILE SELECTION
  // =========================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFormError(
        "Please upload a valid PDF or image file."
      );

      e.target.value = "";
      setSelectedFile(null);

      return;
    }

    // Optional: limit uploaded files to 5 MB.
    if (file.size > 5 * 1024 * 1024) {
      setFormError("The file size must not exceed 5 MB.");

      e.target.value = "";
      setSelectedFile(null);

      return;
    }

    setFormError("");
    setSelectedFile(file);
  };

  // =========================
  // REMOVE SELECTED FILE
  // =========================

  const handleRemoveFile = () => {
    setSelectedFile(null);

    const fileInput = document.getElementById("checklistFile");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =========================
  // SUBMIT COMPLAINT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setFormError("");

    // The date input displays today's date when state is empty.
    // Use that displayed date for validation and submission as well.
    const complaintDate = formValues.complaintDate || todayDate;

    // Validate description.
    const plainDescription = description
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .trim();

    if (!plainDescription) {
      setFormError(
        "Please enter a complaint description."
      );
      return;
    }

    // Validate required fields.
    if (
      !formValues.assetsName.trim() ||
      !complaintDate ||
      !Array.isArray(formValues.sites) ||
      formValues.sites.length === 0 ||
      !Array.isArray(formValues.branchName) ||
      formValues.branchName.length === 0
    ) {
      setFormError(
        "Please fill in all required fields."
      );
      return;
    }

    setLoading(true);

    try {
      // Collect the normal form fields and selected file.
      const formData = new FormData(e.currentTarget);

      // Keep the submitted date consistent with the displayed date.
      formData.set("complaintDate", complaintDate);
      formData.set("assetsName", formValues.assetsName.trim());

      // ReactQuill is controlled by React state,
      // so add its value manually.
      formData.set("description", description);

      // Send every selected site and branch as repeated fields.
      // Multer can parse repeated multipart fields as arrays.
      formData.delete("sites");
      formValues.sites.forEach((site) => {
        formData.append("sites", site);
      });

      formData.delete("branchName");
      formValues.branchName.forEach((branch) => {
        formData.append("branchName", branch);
      });

      // Determine the URL for creating or updating.
      const complaintId = initialData?._id || initialData?.id;

      if (isEditMode && !complaintId) {
        throw new Error(
          "Complaint ID is missing. Cannot update the complaint."
        );
      }

      const url = isEditMode
        ? `/complaints/${complaintId}` : "/complaints";

      // POST creates a complaint; PUT updates it.
      const response = isEditMode
        ? await api.put(url, formData)
        : await api.post(url, formData);

      // Notify the parent only after a successful response.
      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Complaint request failed."
        );
      }

      onSuccess?.(response.data);
      onClose;
    } catch (error) {
      console.error("Complaint submission error:", error);

      setFormError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to submit the complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CLOSE FORM
  // =========================

  if (!open) {
    return null;
  }

  // =========================
  // COMPONENT UI
  // =========================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">

        {/* HEADER */}

        <div className="relative shrink-0 overflow-hidden bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 px-5 py-6 sm:px-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10" />

          <div className="pointer-events-none absolute -bottom-20 right-32 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-lg backdrop-blur-md">
                <ClipboardCheck
                  size={29}
                  className="text-white"
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {isEditMode
                    ? "Update Complaint"
                    : "Apply Complaint"}
                </h2>

                <p className="mt-1 max-w-md text-sm leading-5 text-indigo-100">
                  Submit an asset-related complaint with
                  the required details and supporting
                  checklist.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close complaint form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition hover:bg-white/20 active:scale-95 disabled:opacity-50"
            >
              <X size={21} />
            </button>
          </div>

          <div className="relative mt-5 flex items-center gap-2 text-xs font-medium text-indigo-100">
            <span className="h-2 w-2 rounded-full bg-emerald-300" />

            Complaint Registration

            <span className="text-indigo-200">/</span>

            <span>
              {isEditMode ? "Update Request" : "New Request"}
            </span>
          </div>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
          encType="multipart/form-data"
        >
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7">

            {/* SECTION HEADING */}

            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Complaint Information
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the complaint details accurately.
                </p>
              </div>
            </div>

            {/* FORM FIELDS */}

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">

              {/* ASSET NAME */}

              <div>
                <label
                  htmlFor="assetsName"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Assets Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <ClipboardCheck
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="assetsName"
                    type="text"
                    name="assetsName"
                    defaultValue={formValues.assetsName}
                    value={formValues.assetsName}
                    onChange={handleChange}
       
                    placeholder="Enter the assets name"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* COMPLAINT DATE */}

              <div>
                <label
                  htmlFor="complaintDate"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Complaint Date{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="complaintDate"
                    type="date"
                    name="complaintDate"
                    value={
                      formValues.complaintDate || todayDate
                    }
                    max={todayDate}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* SITE NAME - CHECKBOX MULTI-SELECT DROPDOWN */}
              <div>
                <label
                  htmlFor="sites-dropdown"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Site Name <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-4 z-10 text-slate-400"
                  />

                  <button
                    type="button"
                    id="sites-dropdown"
                    aria-expanded={siteDropdownOpen}
                    aria-haspopup="listbox"
                    onClick={() => {
                      setSiteDropdownOpen((open) => !open);
                      setBranchDropdownOpen(false);
                    }}
                    className="flex min-h-[46px] w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-left text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <span className={formValues.sites.length ? "truncate" : "text-slate-400"}>
                      {formValues.sites.length
                        ? formValues.sites.join(", ")
                        : "Select site(s)"}
                    </span>
                    <span className="ml-3 shrink-0 text-xs text-slate-400">{siteDropdownOpen ? "▲" : "▼"}</span>
                  </button>

                  {siteDropdownOpen && (
                    <div
                      role="listbox"
                      aria-label="Select sites"
                      aria-multiselectable="true"
                      className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                    >
                      {assignedSites.length ? assignedSites.map((site, index) => {
                        const siteValue = getSiteValue(site);
                        if (!siteValue) return null;
                        const checked = formValues.sites.includes(siteValue);

                        return (
                          <label
                            key={`${siteValue}-${index}`}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setFormValues((prev) => ({
                                  ...prev,
                                  sites: checked
                                    ? prev.sites.filter((item) => item !== siteValue)
                                    : [...prev.sites, siteValue],
                                }));
                                setFormError("");
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{siteValue}</span>
                          </label>
                        );
                      }) : (
                        <p className="px-3 py-2 text-sm text-slate-500">No assigned sites available.</p>
                      )}
                    </div>
                  )}
                  <input
                    type="text"
                    name="sites"
                    tabIndex={-1}
                    value={formValues.sites.join(",")}
                    readOnly
                    className="pointer-events-none absolute h-px w-px opacity-0"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* BRANCH NAME - CHECKBOX MULTI-SELECT DROPDOWN */}
              <div>
                <label
                  htmlFor="branchName-dropdown"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Branch Name <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-4 z-10 text-slate-400"
                  />

                  <button
                    type="button"
                    id="branchName-dropdown"
                    aria-expanded={branchDropdownOpen}
                    aria-haspopup="listbox"
                    onClick={() => {
                      setBranchDropdownOpen((open) => !open);
                      setSiteDropdownOpen(false);
                    }}
                    className="flex min-h-[46px] w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-left text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <span className={formValues.branchName.length ? "truncate" : "text-slate-400"}>
                      {formValues.branchName.length
                        ? formValues.branchName.join(", ")
                        : "Select branches"}
                    </span>
                    <span className="ml-3 shrink-0 text-xs text-slate-400">{branchDropdownOpen ? "▲" : "▼"}</span>
                  </button>

                  {branchDropdownOpen && (
                    <div
                      role="listbox"
                      aria-label="Select branches"
                      aria-multiselectable="true"
                      className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
                    >
                      {assignedBranch.length ? assignedBranch.map((branch, index) => {
                        const branchValue = getBranchValue(branch);
                        if (!branchValue) return null;
                        const checked = formValues.branchName.includes(branchValue);

                        return (
                          <label
                            key={`${branchValue}-${index}`}
                            className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setFormValues((prev) => ({
                                  ...prev,
                                  branchName: checked
                                    ? prev.branchName.filter((item) => item !== branchValue)
                                    : [...prev.branchName, branchValue],
                                }));
                                setFormError("");
                              }}
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{branchValue}</span>
                          </label>
                        );
                      }) : (
                        <p className="px-3 py-2 text-sm text-slate-500">No assigned branches available.</p>
                      )}
                    </div>
                  )}
                  <input
                    type="text"
                    name="branchName"
                    tabIndex={-1}
                    value={formValues.branchName.join(",")}
                    readOnly
                    className="pointer-events-none absolute h-px w-px opacity-0"
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageSquareText
                    size={17}
                    className="text-slate-400"
                  />

                  Complaint Description{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="complaint-editor overflow-hidden rounded-xl border border-slate-200 transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Describe the problem, affected asset, and any relevant details..."
                    className="bg-white text-sm"
                    modules={{
                      toolbar: [
                        ["bold", "italic", "underline"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                        ],
                        ["clean"],
                      ],
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Please provide enough information to
                  help the team understand and resolve
                  the issue.
                </p>
              </div>

              {/* CHECKLIST UPLOAD */}

              <div className="md:col-span-2">
                <label
                  htmlFor="checklistFile"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Upload Checklist{" "}
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-5 transition hover:border-indigo-300 hover:bg-indigo-50/30 sm:p-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                      <UploadCloud size={25} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Upload your complaint checklist
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Select an image or PDF file from
                      your device.
                    </p>

                    <label
                      htmlFor="checklistFile"
                      className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-400 hover:bg-indigo-50 active:scale-[0.98]"
                    >
                      <Paperclip size={16} />
                      Choose File
                    </label>

                    <input
                      id="checklistFile"
                      type="file"
                      name="attachment"
                      accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {selectedFile && (
                      <div className="mt-4 flex max-w-full items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                        <FileText
                          size={17}
                          className="shrink-0"
                        />

                        <span className="max-w-[220px] truncate font-medium">
                          {selectedFile.name}
                        </span>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          aria-label="Remove selected file"
                          className="ml-1 rounded-md p-1 hover:bg -emerald-100"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Ensure the uploaded checklist or
                  supporting document is relevant to
                  this complaint.
                </p>
              </div>
            </div>

            {/* ERROR MESSAGE */}

            {formError && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle
                  size={19}
                  className="mt-0.5 shrink-0"
                />

                <p>{formError}</p>
              </div>
            )}

            {/* REQUIRED NOTE */}

            <p className="mt-5 text-xs text-slate-400">
              <span className="font-semibold text-red-500">
                *
              </span>{" "}
              Required fields must be completed before
              submitting.
            </p>
          </div>

          {/* FOOTER */}

          <div className="flex shrink-0 flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl hover:shadow-indigo-600/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:min-w-44"
            >
              {loading ? (
                <>
                  <Loading
                    size={18}
                    className="animate-spin"
                  />

                  {isEditMode
                    ? "Updating..."
                    : "Submitting..."}
                </>
              ) : (
                <>
                  <Send size={17} />

                  {isEditMode
                    ? "Update Complaint"
                    : "Submit Complaint"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyComplaint;
