/**
 * Hiển thị lịch hiện tại lên giao diện người dùng.
 * Sử dụng biến toàn cục 'currentDate' để xác định tháng và năm hiển thị.
 * Cập nhật nội dung văn bản của các phần tử HTML có ID 'monthYear' và 'year'.
 * Tạo và chèn các ô ngày vào phần tử HTML có ID 'calendarGrid',
 * đánh dấu ngày hiện tại được chọn bằng class 'selected-day' và
 * thêm sự kiện onclick để chọn ngày.
 *
 * @returns {void}
 */
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

/**
 * Chuyển lịch sang tháng trước.
 * Giảm giá trị tháng của biến toàn cục 'currentDate' đi 1.
 * Sau đó gọi các hàm 'renderCalendar', 'renderHabitTable' và 'renderChart'
 * để cập nhật giao diện với tháng mới.
 *
 * @returns {void}
 */
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    renderHabitTable();
    renderChart();
}

/**
 * Chuyển lịch sang tháng tiếp theo.
 * Tăng giá trị tháng của biến toàn cục 'currentDate' lên 1.
 * Sau đó gọi các hàm 'renderCalendar', 'renderHabitTable' và 'renderChart'
 * để cập nhật giao diện với tháng mới.
 *
 * @returns {void}
 */
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    renderHabitTable();
    renderChart();
}

/**
 * Thay đổi năm hiển thị trong lịch.
 * Tăng hoặc giảm giá trị năm của các biến toàn cục 'currentDate' và 'selectedDate'
 * dựa trên giá trị 'delta' truyền vào.
 * Sau đó gọi các hàm 'renderCalendar', 'renderHabitTable' và 'renderChart'
 * để cập nhật giao diện với năm mới.
 *
 * @param {number} delta - Số năm để thay đổi (ví dụ: -1 để lùi 1 năm, 1 để tiến 1 năm).
 * @returns {void}
 */
function changeYear(delta) {
    currentDate.setFullYear(currentDate.getFullYear() + delta);
    selectedDate.setFullYear(selectedDate.getFullYear() + delta);
    renderCalendar();
    renderHabitTable();
    renderChart();
}

/**
 * Chọn một ngày cụ thể trên lịch.
 * Tạo một đối tượng Date mới từ năm, tháng của 'currentDate' và ngày được chọn.
 * Gán đối tượng này cho biến toàn cục 'selectedDate'.
 * Sau đó gọi các hàm 'renderCalendar', 'renderHabitTable' và 'renderChart'
 * để cập nhật giao diện với ngày được chọn.
 *
 * @param {number} day - Số ngày được chọn trong tháng.
 * @returns {void}
 */
function selectDate(day) {
    selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    renderCalendar();
    renderHabitTable();
    renderChart();
}

/**
 * Lấy ngày đầu tiên của tuần chứa một ngày cụ thể.
 * Tạo một bản sao của đối tượng Date truyền vào và điều chỉnh ngày
 * lùi lại cho đến khi đến Chủ Nhật (ngày 0 trong tuần).
 *
 * @param {Date} date - Đối tượng Date đại diện cho ngày cần tìm đầu tuần.
 * @returns {Date} Một đối tượng Date đại diện cho ngày đầu tiên của tuần.
 */
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
}

/**
 * Lấy danh sách 7 ngày trong tuần bắt đầu từ một ngày cụ thể.
 * Sử dụng hàm 'getWeekStart' để xác định ngày đầu tuần và sau đó
 * tạo một mảng chứa 7 đối tượng Date liên tiếp.
 *
 * @param {Date} date - Đối tượng Date đại diện cho một ngày trong tuần cần lấy.
 * @returns {Array<Date>} Một mảng chứa 7 đối tượng Date đại diện cho các ngày trong tuần.
 */
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

/**
 * Thêm một thói quen mới vào danh sách.
 * Lấy giá trị từ phần tử input có ID 'habitInput', loại bỏ khoảng trắng ở đầu và cuối.
 * Nếu giá trị không rỗng, tạo một object thói quen mới với ID là timestamp hiện tại
 * và văn bản là giá trị input. Thêm thói quen mới vào mảng toàn cục 'habits',
 * lưu mảng 'habits' vào Local Storage, làm trống input và gọi các hàm render.
 *
 * @returns {void}
 */
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

/**
 * Xóa một thói quen khỏi danh sách.
 * Lọc mảng toàn cục 'habits' để loại bỏ thói quen có ID trùng khớp.
 * Xóa dữ liệu liên quan đến thói quen này khỏi object 'habitData' trong Local Storage.
 * Sau đó lưu lại mảng 'habits' và object 'habitData' vào Local Storage và gọi các hàm render.
 *
 * @param {number} id - ID của thói quen cần xóa.
 * @returns {void}
 */
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

/**
 * Hiển thị bảng theo dõi thói quen cho tuần hiện tại được chọn.
 * Lấy danh sách các ngày trong tuần hiện tại bằng hàm 'getWeekDates'.
 * Cập nhật tiêu đề bảng với các ngày trong tuần.
 * Tạo các hàng cho mỗi thói quen trong mảng 'habits', hiển thị trạng thái
 * (unknown, done, not_done) cho từng ngày trong tuần bằng các dropdown select.
 * Thêm nút xóa cho mỗi thói quen.
 *
 * @returns {void}
 */
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

/**
 * Cập nhật trạng thái của một thói quen cho một ngày cụ thể.
 * Lấy ID thói quen, ngày và trạng thái mới. Cập nhật object 'habitData'
 * với trạng thái mới và lưu object 'habitData' vào Local Storage.
 * Sau đó gọi hàm 'renderChart' để cập nhật biểu đồ.
 *
 * @param {number} habitId - ID của thói quen cần cập nhật.
 * @param {string} dateKey - Chuỗi đại diện cho ngày (YYYY-MM-DD).
 * @param {string} status - Trạng thái mới của thói quen ('unknown', 'done', 'not_done').
 * @returns {void}
 */
function updateHabitStatus(habitId, dateKey, status) {
    if (!habitData[dateKey]) habitData[dateKey] = {};
    habitData[dateKey][habitId] = status;
    localStorage.setItem('habitData', JSON.stringify(habitData));
    renderChart();
}

/**
 * Hiển thị biểu đồ thống kê tỷ lệ hoàn thành thói quen trong tuần hiện tại.
 * Lấy danh sách các ngày trong tuần hiện tại. Tính toán tỷ lệ hoàn thành
 * (đã làm trừ không làm) cho mỗi ngày. Sử dụng thư viện Chart.js để vẽ biểu đồ cột.
 * Nếu biểu đồ đã tồn tại, nó sẽ bị hủy trước khi vẽ lại.
 *
 * @returns {void}
 */
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