import moment from "moment";
import "moment-recur-ts";

type temp = {
  [key: string]: any;
};

export default class ScheduleMapper {
  async toCalendarSchedule(scheduleList: any) {
    let calendarSchedule: any[] = [];
    console.log('scheduleList', scheduleList)
    for (const index in scheduleList) {
      this.sortByIntervalType(calendarSchedule, scheduleList[index]);
    }

    return calendarSchedule;
  }

  async sortByIntervalType(calendarSchedule: any[], schedule: any) {
    let scheduleInfo = await JSON.parse(JSON.stringify(schedule));
    let startDateList = [];
    let recurrence: temp = {};
    let scheTime = await this.getTime(schedule);

    switch (scheduleInfo.intervalType) {
      case "ONCE":
        if (scheduleInfo !== undefined)
          this.scheduleDtoToEvent(scheduleInfo).then((event) => {
            calendarSchedule.push(event);
          });
        break;

      // 매일 반복
      case "DAILY":
        recurrence = moment()
          .recur(scheduleInfo.startDate, scheduleInfo.endDate)
          .every(scheduleInfo.intervalValue)
          .days();

        startDateList = recurrence
          .all("L")
          .map((startDate: moment.MomentInput) => {
            return moment(startDate)
              .add(scheTime.hours, "h")
              .add(scheTime.minutes, "m")
              .add(scheTime.seconds, "s")
              .format("YYYY-MM-DDTHH:mm");
          });

        this.pushEventsInList(calendarSchedule, startDateList, scheduleInfo);
        break;

      case "WEEKLY":
        recurrence = moment()
          .recur(scheduleInfo.startDate, scheduleInfo.endDate)
          .every(moment(scheduleInfo.startDate).day())
          .daysOfWeek();

        startDateList = recurrence
          .all("L")
          .map((startDate: moment.MomentInput) => {
            return moment(startDate)
              .add(scheTime.hours, "h")
              .add(scheTime.minutes, "m")
              .add(scheTime.seconds, "s")
              .format("YYYY-MM-DDTHH:mm");
          });

        this.getFilteredList(startDateList, scheduleInfo).then((list) => {
          this.pushEventsInList(calendarSchedule, list, scheduleInfo);
        });
        break;

      case "MONTHLY":
        recurrence = moment()
          .recur(scheduleInfo.startDate, scheduleInfo.endDate)
          .every(moment(scheduleInfo.startDate).date())
          .daysOfMonth();

        startDateList = recurrence
          .all("L")
          .map((startDate: moment.MomentInput) => {
            return moment(startDate)
              .add(scheTime.hours, "h")
              .add(scheTime.minutes, "m")
              .add(scheTime.seconds, "s")
              .format("YYYY-MM-DDTHH:mm");
          });

        this.getFilteredList(startDateList, scheduleInfo).then((list) => {
          this.pushEventsInList(calendarSchedule, list, scheduleInfo);
        });
        break;

      case "ANNUAL":
        recurrence = moment()
          .recur(scheduleInfo.startDate, scheduleInfo.endDate)
          .every(moment(scheduleInfo.startDate).date())
          .daysOfMonth()
          .every(moment(scheduleInfo.startDate).month())
          .monthsOfYear();

        startDateList = recurrence
          .all("L")
          .map((startDate: moment.MomentInput) => {
            return moment(startDate)
              .add(scheTime.hours, "h")
              .add(scheTime.minutes, "m")
              .add(scheTime.seconds, "s")
              .format("YYYY-MM-DDTHH:mm");
          });

        this.getFilteredList(startDateList, scheduleInfo).then((list) => {
          this.pushEventsInList(calendarSchedule, list, scheduleInfo);
        });
        break;
      default:
        console.log(scheduleInfo);
        console.log("스케쥴 형식이 다릅니다.");
    }
  }

  async scheduleDtoToEvent(schedule: any) {
    let convertedSchedule = JSON.parse(JSON.stringify(schedule));
    const startTime = new Date(schedule["startDate"]);
    const endTime = new Date(schedule["endDate"]);
    const intervalType = schedule["intervalType"];

    Object.assign(convertedSchedule, { start: startTime });

    if (intervalType === "ONCE") {
      Object.assign(convertedSchedule, { end: endTime });
    } else {
      Object.assign(convertedSchedule, {
        end: new Date(startTime.getTime() + schedule["duration"] * 60000),
      });
    }

    return convertedSchedule;
  }

  async getTime(schedule: { startDate: moment.MomentInput }) {
    return {
      hours: moment(schedule.startDate).hours(),
      minutes: moment(schedule.startDate).minutes(),
      seconds: moment(schedule.startDate).seconds(),
    };
  }

  async getFilteredList(
    startDateList: string | any[],
    scheduleInfo: { intervalValue: number }
  ) {
    let filterdStartDateList = [];
    for (let i = 0; i < startDateList.length; i += scheduleInfo.intervalValue) {
      filterdStartDateList.push(startDateList.at(i));
    }
    return filterdStartDateList;
  }

  async pushEventsInList(
    calendarSchedule: any[],
    startDateList: any[],
    scheduleInfo: { startDate: any }
  ) {
    for (const index in startDateList) {
      scheduleInfo.startDate = startDateList[index];
      this.scheduleDtoToEvent(scheduleInfo).then((event) => {
        calendarSchedule.push(event);
      });
    }
  }
}
