using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Queries.GetSheetReport;

public class GetSheetReportQuery : IRequest<DailyAttendanceReportDto>
{
    public int SheetId { get; set; }

    public GetSheetReportQuery(int sheetId)
    {
        SheetId = sheetId;
    }
}