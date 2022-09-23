"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hourStringToMinutes = void 0;
function hourStringToMinutes(hourString) {
    const [hours, minutes] = hourString.split(':').map(Number);
    const minutesAmount = (hours * 60) + minutes;
    return minutesAmount;
}
exports.hourStringToMinutes = hourStringToMinutes;
