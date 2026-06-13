// ============================================
// ARAB UNITY SCHOOL
// Reusable Request Details Dialog
// Used by HOD and HOS dashboards
// Prevents double approve/reject clicks
// ============================================

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
  Chip,
} from "@mui/material";

export default function RequestDetailsDialog({
  open,
  request,
  comment,
  setComment,
  onClose,
  onApprove,
  onReturn,
  onReject,
  actionLoading = false,
}) {
  // Do not render if no request is selected
  if (!request) return null;

  // Status chip color
  const getStatusColor = (status) => {
    if (!status) return "default";

    if (status.includes("Rejected")) return "error";
    if (status.includes("Approved")) return "success";
    if (status.includes("Forwarded")) return "info";
    if (status.includes("Completed")) return "success";
    if (status.includes("Pending")) return "warning";

    return "default";
  };

  return (
    <Dialog
      open={open}
      onClose={actionLoading ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      {/* Dialog title */}
      <DialogTitle fontWeight={700}>
        Request Details - {request.requestNumber}
      </DialogTitle>

      <DialogContent>
        {/* Basic request information */}
        <Box sx={{ display: "grid", gap: 1.5, mt: 1 }}>
          <Typography>
            <strong>Teacher:</strong> {request.teacher || "-"}
          </Typography>

          <Typography>
            <strong>Employee ID:</strong> {request.employeeId || "-"}
          </Typography>

          <Typography>
            <strong>Department:</strong> {request.department || "-"}
          </Typography>

          <Typography>
            <strong>Subject:</strong> {request.subject || "-"}
          </Typography>

          <Typography>
            <strong>Purpose:</strong> {request.purpose || "-"}
          </Typography>

          <Typography>
            <strong>Pages:</strong> {request.pages || 0}
          </Typography>

          <Typography>
            <strong>Copies:</strong> {request.copies || 0}
          </Typography>

          <Typography>
            <strong>Total Sheets:</strong> {request.sheets || 0}
          </Typography>

          <Typography>
            <strong>Priority:</strong> {request.priority || "-"}
          </Typography>

          <Typography>
            <strong>Submitted Date:</strong> {request.submittedDate || "-"}
          </Typography>

          <Typography>
            <strong>Status:</strong>{" "}
            <Chip
              label={request.status || "-"}
              color={getStatusColor(request.status)}
              size="small"
            />
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Printing information */}
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Printing Details
        </Typography>

        <Box sx={{ display: "grid", gap: 1.5 }}>
          <Typography>
            <strong>Paper Size:</strong> {request.paperSize || "-"}
          </Typography>

          <Typography>
            <strong>Print Type:</strong> {request.printType || "-"}
          </Typography>

          <Typography>
            <strong>Print Side:</strong> {request.printSide || "-"}
          </Typography>

          <Typography>
            <strong>Exam Paper:</strong>{" "}
            {request.isExam === true || request.isExam === 1 ? "Yes" : "No"}
          </Typography>

          <Typography>
            <strong>Due Date:</strong> {request.dueDate || "-"}
          </Typography>

          <Typography>
            <strong>Request Remarks:</strong> {request.requestRemarks || "-"}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Attachment information */}
        <Typography fontWeight={700} sx={{ mb: 1 }}>
          Attachments
        </Typography>

        {request.attachments?.length > 0 ? (
          request.attachments.map((file, index) => (
            <Typography key={index} variant="body2">
              📎 {file}
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No attachments uploaded.
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Approval comment */}
        <TextField
          label="Approval Comment / Remarks"
          placeholder="Add comment before approving, returning, or rejecting..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          fullWidth
          multiline
          minRows={4}
          disabled={actionLoading}
        />
      </DialogContent>

      {/* Action buttons */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={actionLoading}>
          Cancel
        </Button>

        <Button
          color="warning"
          variant="outlined"
          onClick={onReturn}
          disabled={actionLoading}
        >
          Return for Revision
        </Button>

        <Button
          color="error"
          variant="outlined"
          onClick={onReject}
          disabled={actionLoading}
        >
          Reject
        </Button>

        <Button
          color="success"
          variant="contained"
          onClick={onApprove}
          disabled={actionLoading}
        >
          {actionLoading ? "Processing..." : "Approve"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}