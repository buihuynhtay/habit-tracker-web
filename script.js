        let currentDate = new Date(2025, 4, 4); // Bắt đầu với ngày hiện tại (May 4, 2025)
        let selectedDate = new Date(currentDate);
        let habits = JSON.parse(localStorage.getItem('habits') || '[]');
        let habitData = JSON.parse(localStorage.getItem('habitData') || '{}');
        let chart;

        function renderCalendar() {
            const monthYear = document.getElementById('monthYear');
            const calendarGrid = document.getElementById('calendarGrid');
            const yearSpan = document.getElementById('year');
            const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

            monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
            yearSpan.textContent = currentDate.getFullYear();

            calendarGrid.innerHTML = `
                <div class="day-name">CN</div>
                <div class="day-name">T2</div>
                <div class="day-name">T3</div>
                <div class="day-name">T4</div>
                <div class="day-name">T5</div>
                <div class="day-name">T6</div>
                <div class="day-name">T7</div>
            `;

            const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                calendarGrid.innerHTML += `<div></div>`;
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isSelected = date.toDateString() === selectedDate.toDateString();
                calendarGrid.innerHTML += `
                    <div class="day ${isSelected ? 'selected-day' : ''}" onclick="selectDate(${day})">${day}</div>
                `;
            }
        }

        function prevMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
            renderHabitTable();
            renderChart();
        }

        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
            renderHabitTable();
            renderChart();
        }

        function changeYear(delta) {
            currentDate.setFullYear(currentDate.getFullYear() + delta);
            selectedDate.setFullYear(selectedDate.getFullYear() + delta);
            renderCalendar();
            renderHabitTable();
            renderChart();
        }

        function selectDate(day) {
            selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            renderCalendar();
            renderHabitTable();
            renderChart();
        }

        function getWeekStart(date) {
            const d = new Date(date);
            const day = d.getDay();
            d.setDate(d.getDate() - day);
            return d;
        }

        function getWeekDates(date) {
            const weekStart = getWeekStart(date);
            const dates = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(weekStart);
                d.setDate(d.getDate() + i);
                dates.push(d);
            }
            return dates;
        }

        function addHabit() {
            const habitInput = document.getElementById('habitInput');
            const habitText = habitInput.value.trim();

            if (habitText === '') {
                alert('Vui lòng nhập thói quen!');
                return;
            }

            const habit = {
                id: Date.now(),
                text: habitText
            };

            habits.push(habit);
            localStorage.setItem('habits', JSON.stringify(habits));
            habitInput.value = '';
            renderHabitTable();
            renderChart();
        }

        function deleteHabit(id) {
            habits = habits.filter(h => h.id !== id);
            for (const date in habitData) {
                delete habitData[date][id];
            }
            localStorage.setItem('habits', JSON.stringify(habits));
            localStorage.setItem('habitData', JSON.stringify(habitData));
            renderHabitTable();
            renderChart();
        }

        function renderHabitTable() {
            const weekDates = getWeekDates(selectedDate);
            const habitTableHead = document.getElementById('habitTableHead');
            const habitTableBody = document.getElementById('habitTableBody');

            habitTableHead.innerHTML = `
                <tr>
                    <th>Thói Quen</th>
                    ${weekDates.map(d => `<th>${d.getDate()}/${d.getMonth() + 1}</th>`).join('')}
                    <th></th>
                </tr>
            `;

            habitTableBody.innerHTML = habits.map(habit => `
                <tr>
                    <td>${habit.text}</td>
                    ${weekDates.map(date => {
                        const dateKey = date.toISOString().split('T')[0];
                        const status = habitData[dateKey]?.[habit.id] || 'unknown';
                        let icon = '';
                        switch (status) {
                            case 'done':
                                icon = '✔️'; // Checkmark Unicode
                                break;
                            case 'not_done':
                                icon = '❌'; // X Unicode
                                break;
                            default:
                                icon = '❓'; // Question mark Unicode
                                break;
                        }
                        return `
                            <td>
                                <select onchange="updateHabitStatus(${habit.id}, '${dateKey}', this.value)">
                                    <option value="unknown" ${status === 'unknown' ? 'selected' : ''}>❓</option>
                                    <option value="done" ${status === 'done' ? 'selected' : ''}>✔️</option>
                                    <option value="not_done" ${status === 'not_done' ? 'selected' : ''}>❌</option>
                                </select>
                            </td>
                        `;
                    }).join('')}
                    <td><button class="delete-btn" onclick="deleteHabit(${habit.id})">Xóa</button></td>
                </tr>
            `).join('');
        }

        function updateHabitStatus(habitId, dateKey, status) {
            if (!habitData[dateKey]) habitData[dateKey] = {};
            habitData[dateKey][habitId] = status;
            localStorage.setItem('habitData', JSON.stringify(habitData));
            renderChart();
        }

        function renderChart() {
            const weekDates = getWeekDates(selectedDate);
            const ctx = document.getElementById('habitChart').getContext('2d');

            const percentages = weekDates.map(date => {
                const dateKey = date.toISOString().split('T')[0];
                let doneCount = 0;
                let notDoneCount = 0;
                habits.forEach(habit => {
                    const status = habitData[dateKey]?.[habit.id];
                    if (status === 'done') {
                        doneCount++;
                    } else if (status === 'not_done') {
                        notDoneCount++;
                    }
                });

                const totalKnown = doneCount + notDoneCount;
                return totalKnown > 0 ? ((doneCount / totalKnown) * 100) - ((notDoneCount / totalKnown) * 100) : 0;
            });

            if (chart) chart.destroy();
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: weekDates.map(d => `${d.getDate()}/${d.getMonth() + 1}`),
                    datasets: [{
                        label: 'Tỷ lệ hoàn thành (Đã làm - Không làm)',
                        data: percentages,
                        backgroundColor: percentages.map(p => p >= 0 ? '#28a745' : '#dc3545')
                    }]
                },
                options: {
                    scales: {
                        y: {
                            min: -100,
                            max: 100,
                            title: { display: true, text: 'Tỷ lệ (%)' }
                        }
                    }
                }
            });
        }

        // Initial render
        renderCalendar();
        renderHabitTable();
        renderChart();

        // Enter key for adding habits
        document.getElementById('habitInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addHabit();
            }
        });
   