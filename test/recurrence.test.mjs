import test from 'node:test';
import assert from 'node:assert/strict';

test('Recurrence Engine: Date and time block calculations', () => {
  // Test time blocks
  function getTaskTimeBlock(time) {
    if (!time) return 'no-time';
    const hour = parseInt(time.split(':')[0], 10);
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  assert.equal(getTaskTimeBlock('08:30'), 'morning');
  assert.equal(getTaskTimeBlock('11:59'), 'morning');
  assert.equal(getTaskTimeBlock('12:00'), 'afternoon');
  assert.equal(getTaskTimeBlock('15:45'), 'afternoon');
  assert.equal(getTaskTimeBlock('18:00'), 'evening');
  assert.equal(getTaskTimeBlock('22:15'), 'evening');
  assert.equal(getTaskTimeBlock(undefined), 'no-time');
});

test('Persistent Reminders: rollover filter for uncompleted tasks', () => {
  function getPersistentReminders(tasks, today) {
    return tasks.filter(
      (t) => t.isPersistentReminder && !t.isCompleted && t.date <= today
    );
  }

  const sampleTasks = [
    { id: '1', title: 'Task 1', date: '2026-10-20', isPersistentReminder: true, isCompleted: false },
    { id: '2', title: 'Task 2', date: '2026-10-20', isPersistentReminder: true, isCompleted: true },
    { id: '3', title: 'Task 3', date: '2026-10-21', isPersistentReminder: false, isCompleted: false },
    { id: '4', title: 'Task 4', date: '2026-10-22', isPersistentReminder: true, isCompleted: false },
    { id: '5', title: 'Task 5', date: '2026-10-25', isPersistentReminder: true, isCompleted: false },
  ];

  const pending = getPersistentReminders(sampleTasks, '2026-10-22');
  assert.equal(pending.length, 2);
  assert.deepEqual(pending.map((t) => t.id), ['1', '4']);
});
