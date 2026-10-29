import React, { useState } from "react";

import {
  CheckIcon,
  XIcon,
  Loader2,
  EditIcon,
  CalendarDays,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Paperclip,
} from "lucide-react";

import { format, isValid, parseISO } from "date-fns";
import toast from "react-hot-toast";
import api from "../../api/axios";

const ComplaintHistory = ({
  complaint = [],
  onEdit,
  isAdmin,
}) => {
  const [processing, setProcessing] = useState(null);

  // ==========================================
  // GET ATTACHMENT URL
  // ==========================================

  const getAttachmentUrl = (attachment) => {
  if (!attachment || typeof attachment !== "string") {
    return "";
  }

  // Normalize Windows-style paths
  const normalizedPath = attachment.replace(/\\/g, "/").trim();

  // If attachment is already a complete URL
  if (/^https?:\/\//i.test(normalizedPath)) {
    try {
      const url = new URL(normalizedPath);

      // Convert /uploads/ to /api/uploads/ on production
      if (
        url.hostname === "sundigo.sundigosewasamiti.in" &&
        /^\/uploads\//i.test(url.pathname)
      ) {
        url.pathname = url.pathname.replace(
          /^\/uploads\//i,
          "/api/uploads/"
        );
      }

      return url.toString();
    } catch (error) {
      console.error("Invalid attachment URL:", error);
      return normalizedPath;
    }
  }

  // Get API base URL, e.g. https://sundigo.sundigosewasamiti.in/api
  const configuredBaseURL =
    api.defaults.baseURL || window.location.origin;

  try {
    const parsedURL = new URL(
      configuredBaseURL,
      window.location.origin
    );

    // Keep /api in the URL
    const apiBaseURL = `${parsedURL.origin}${parsedURL.pathname.replace(
      /\/+$/,
      ""
    )}`;

    const relativePath = normalizedPath.replace(/^\/+/, "");

    // If path already starts with uploads/
    if (/^uploads\//i.test(relativePath)) {
      return `${apiBaseURL}/${relativePath}`;
    }

    // If only filename is stored
    return `${apiBaseURL}/uploads/${relativePath}`;
  } catch (error) {
    console.error("Unable to construct attachment URL:", error);
    return "";
  }
};

  // ==========================================
  // DOWNLOAD IMAGE OR PDF
  // ==========================================

  const downloadAttachment = async (attachment) => {
    if (!attachment) {
      toast.error("No attachment available.");
      return;
    }

    try {
      const attachmentURL = getAttachmentUrl(attachment);

      const response = await api.get(attachmentURL, {
        responseType: "blob",
      });

      const blobURL = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");

      link.href = blobURL;

      // Preserve the original filename and extension.
      let fileName =
        attachment
          .replace(/\\/g, "/")
          .split("/")
          .pop() || "attachment";

      fileName = fileName.split("?")[0].split("#")[0];

      try {
        fileName = decodeURIComponent(fileName);
      } catch {
        // Use the original filename if decoding fails.
      }

      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the generated browser URL.
      window.setTimeout(() => {
        window.URL.revokeObjectURL(blobURL);
      }, 1000);
    } catch (error) {
      console.error(
        "Attachment download error:",
        error.response?.data || error
      );

      toast.error(
        "Unable to download attachment. Please check the file URL and try again."
      );
    }
  };

  // ==========================================
  // SAFE COMPLAINT ARRAY
  // ==========================================

  const complaints = Array.isArray(complaint)
    ? complaint
    : [];

  // ==========================================
  // FORMAT COMPLAINT DATE
  // ==========================================

  const formatComplaintDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    try {
      const date =
        typeof dateValue === "string"
          ? parseISO(dateValue)
          : new Date(dateValue);

      return isValid(date)
        ? format(date, "dd MMM yyyy")
        : "N/A";
    } catch {
      return "N/A";
    }
  };

  // ==========================================
  // FORMAT ARRAYS
  // ==========================================

  const formatList = (value) => {
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : "N/A";
    }

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    return "N/A";
  };

  // ==========================================
  // REMOVE HTML FROM DESCRIPTION
  // ==========================================

  const getPlainText = (value) => {
    if (typeof value !== "string") {
      return "";
    }

    return value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .trim();
  };

  // ==========================================
  // UPDATE COMPLAINT STATUS - ADMIN
   // ==========================================

  const handleStatusUpdate = async (id, status) => {
    
    if (!id) {
      toast.error("Complaint ID is missing.");
      return;
    }

    if (!status) {
      toast.error("Please select a valid status.");
      return;
    }

    setProcessing(id);

    try {
      const response = await api.put(`/complaints/${id}`, {
        status,
      });

      toast.success(
        response.data?.message ||
          "Complaint status updated successfully."
      );

      // Reload the complaints in the parent component if needed.
      window.dispatchEvent(
        new CustomEvent("complaintsUpdated")
      );
    } catch (error) {
      console.error(
        "Complaint status update error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to update complaint status."
      );
    } finally {
      setProcessing(null);
    }
  };

  // ==========================================
  // EDIT COMPLAINT - EMPLOYEE
  // ==========================================

  const handleEdit = (item) => {
    const complaintId = item?._id || item?.id;

    if (!complaintId) {
      toast.error("Complaint ID is missing.");
      return;
    }

    if (typeof onEdit !== "function") {
      toast.error("Edit functionality is not configured.");
      return;
    }

    onEdit(item);
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusBadge = (status) => {
    const normalizedStatus = (
      status || "PENDING"
    )
      .toUpperCase()
      .replace(/[\s-]+/g, "_");

    const styles = {
      PENDING: "bg-amber-100 text-amber-700 ring-amber-200",

      SOLVED:
        "bg-emerald-100 text-emerald-700 ring-emerald-200",

      RESOLVED:
        "bg-emerald-100 text-emerald-700 ring-emerald-200",

      UNSOLVED:
        "bg-rose-100 text-rose-700 ring-rose-200",

      IN_PROGRESS:
        "bg-blue-100 text-blue-700 ring-blue-200",
    };

    return (
      <span
        className={`inline-flex items-center whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
          styles[normalizedStatus] ||
          "bg-slate-100 text-slate-700 ring-slate-200"
        }`}
      >
        {normalizedStatus.replace(/_/g, " ")}
      </span>
    );
  };

  // ==========================================
  // TABLE
  // ==========================================

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}

      <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Complaint History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View and manage submitted complaints.
          </p>
        </div>

        <span className="w-fit rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          {complaints.length}{" "}
          {complaints.length === 1
            ? "Complaint"
            : "Complaints"}
        </span>
      </div>

      {/* TABLE */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1150px] divide-y divide-slate-200 text-left">

          <thead className="bg-slate-50">
            <tr>
              {isAdmin && (
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                  Employee Name
                </th>
              )}

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                Asset Name
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                Branch
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                Site
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                Complaint Date
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                Description
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                Attachment
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">

            {complaints.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 9 : 8}
                  className="px-6 py-14 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <AlertCircle
                      size={36}
                      className="mb-3 text-slate-300"
                    />

                    <p className="font-semibold text-slate-700">
                      No complaints found
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Submitted complaints will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              complaints.map((item) => {
                const id = item?._id || item?.id;

                const employeeName = [
                  item?.employee?.firstName,
                  item?.employee?.lastName,
                ]
                  .filter(Boolean)
                  .join(" ");

                const status = (
                  item?.status || "PENDING"
                ).toUpperCase();

                const isProcessing = processing === id;

                // Attachment details
                const attachment =
                  typeof item?.attachment === "string"
                    ? item.attachment.trim()
                    : "";

                const attachmentURL = attachment
                  ? getAttachmentUrl(attachment)
                  : "";

                const fileName =
                  attachment.replace(/\\/g, "/").split("/").pop() ||
                  "";

                const isImage = /\.(jpe?g|png|webp|gif)$/i.test(
                  fileName
                );

                const isPDF = /\.pdf$/i.test(fileName);

                const readableDescription = getPlainText(
                  item?.description
                );

                return (
                  <tr
                    key={
                      id ||
                      `${item?.assetsName}-${item?.complaintDate}`
                    }
                    className="transition-colors hover:bg-slate-50"
                  >

                    {/* EMPLOYEE */}

                    {isAdmin && (
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="font-semibold text-slate-800">
                          {employeeName || "Unknown Employee"}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {item?.employee?.email || ""}
                        </div>
                      </td>
                    )}

                    {/* ASSET NAME */}

                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-800">
                        {item?.assetsName || "N/A"}
                      </span>
                    </td>

                    {/* BRANCH */}

                    <td className="max-w-[220px] px-5 py-4 text-sm text-slate-600">
                      {formatList(item?.branchName)}
                    </td>

                    {/* SITE */}

                    <td className="max-w-[220px] px-5 py-4 text-sm text-slate-600">
                      {formatList(
                        item?.sites ?? item?.siteName
                      )}
                    </td>

                    {/* COMPLAINT DATE */}

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <CalendarDays
                          size={15}
                          className="shrink-0 text-slate-400"
                        />

                        {formatComplaintDate(
                          item?.complaintDate
                        )}
                      </div>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="max-w-[260px] px-5 py-4">
                      <div
                        className="line-clamp-3 text-sm text-slate-600"
                        title={readableDescription}
                      >
                        {readableDescription || "N/A"}
                      </div>
                    </td>

                    {/* ATTACHMENT: IMAGE / PDF / DOWNLOAD */}

                    <td className="px-5 py-4">
                      {!attachment ? (
                        <span className="text-xs text-slate-400">
                          No attachment
                        </span>
                      ) : (
                        <div className="flex min-w-[190px] flex-col gap-2">

                          {/* IMAGE PREVIEW */}

                          {isImage && (
                            <a
                              href={attachmentURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open image"
                              className="block w-fit"
                            >
                              <img
                                src={attachmentURL}
                                alt="Complaint attachment"
                                loading="lazy"
                                className="h-20 w-28 rounded-lg border border-slate-200 bg-slate-50 object-cover transition hover:opacity-80"
                              />
                            </a>
                          )}

                          {/* PDF FILE PREVIEW ICON */}

                          {isPDF && (
                            <a
                              href={attachmentURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Open PDF"
                              className="flex w-fit items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                            >
                              <FileText size={20} />

                              <span>PDF Document</span>
                            </a>
                          )}

                          {/* OTHER FILE TYPES */}

                          {!isImage && !isPDF && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Paperclip size={18} />

                              <span>Attachment</span>
                            </div>
                          )}

                          {/* FILE NAME */}

                          <p
                            className="max-w-[190px] truncate text-xs text-slate-500"
                            title={fileName}
                          >
                            {fileName}
                          </p>

                          {/* VIEW AND DOWNLOAD */}

                          <div className="flex flex-wrap items-center gap-2">

                            <a
                              href={attachmentURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View attachment"
                              className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                            >
                              <Eye size={14} />
                              View
                            </a>

                            <button
                              type="button"
                              onClick={() =>
                                downloadAttachment(attachment)
                              }
                              title="Download attachment"
                              className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <Download size={14} />
                              Download
                            </button>

                          </div>
                        </div>
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="whitespace-nowrap px-5 py-4">
                      {getStatusBadge(status)}
                    </td>

                    {/* ACTIONS */}

             {/* ACTIONS */}

<td className="whitespace-nowrap px-5 py-4"> <div className="flex items-center justify-center gap-2">

{/* ADMIN: CHANGE COMPLAINT STATUS */}

{isAdmin && (
  <>
    {/* MARK AS SOLVED */}
    {status !== "SOLVED" && status !== "RESOLVED" && (
      <button
        type="button"
        onClick={() => handleStatusUpdate(id, "SOLVED")}
        disabled={!id || isProcessing}
        title="Mark as solved"
        aria-label="Mark complaint as solved"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <CheckIcon size={16} />
        )}
      </button>
    )}

    {/* MARK AS UNSOLVED */}
    {status !== "UNSOLVED" && (
      <button
        type="button"
        onClick={() => handleStatusUpdate(id, "UNSOLVED")}
        disabled={!id || isProcessing}
        title="Mark as unsolved"
        aria-label="Mark complaint as unsolved"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <XIcon size={16} />
        )}
      </button>
    )}

    {/* MARK AS PENDING */}
    {status !== "PENDING" && (
      <button
        type="button"
        onClick={() => handleStatusUpdate(id, "PENDING")}
        disabled={!id || isProcessing}
        title="Mark as pending"
        aria-label="Mark complaint as pending"
        className="inline-flex h-9 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Pending
      </button>
    )}
  </>
)}

{/* EMPLOYEE: EDIT COMPLAINT */}

{!isAdmin && (
  <button
    type="button"
    onClick={() => handleEdit(item)}
    disabled={!id}
    title="Edit complaint"
    aria-label="Edit complaint"
    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
  >
    <EditIcon size={16} />
  </button>
)}

</div> </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplaintHistory;