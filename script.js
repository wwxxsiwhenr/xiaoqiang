// 照片数据
const photos = [
    {
        src: "屏幕截图 2025-07-24 124848.png",
        title: "7月24日的精彩瞬间",
        date: "2025-07-24"
    },
    {
        src: "屏幕截图 2025-07-26 100711.png",
        title: "7月26日的美好回忆",
        date: "2025-07-26"
    },
    {
        src: "屏幕截图 2025-07-29 110114.png",
        title: "7月29日的难忘时刻",
        date: "2025-07-29"
    },
    {
        src: "屏幕截图 2025-07-29 211448.png",
        title: "7月29日的夜晚时光",
        date: "2025-07-29"
    },
    {
        src: "屏幕截图 2025-08-17 161210.png",
        title: "8月17日的快乐时光",
        date: "2025-08-17"
    },
    {
        src: "屏幕截图 2025-08-21 153009.png",
        title: "8月21日的精彩瞬间",
        date: "2025-08-21"
    }
];

let currentPhotos = [...photos];
let autoPlayInterval = null;
let isAutoPlay = false;

// DOM元素
const photoContainer = document.getElementById('photoContainer');
const photoViewer = document.getElementById('photoViewer');
const viewerImage = document.getElementById('viewerImage');
const caption = document.getElementById('caption');
const closeBtn = document.querySelector('.close');
const shuffleBtn = document.getElementById('shuffleBtn');
const autoPlayBtn = document.getElementById('autoPlayBtn');
const resetBtn = document.getElementById('resetBtn');
const loading = document.getElementById('loading');

// 初始化
function init() {
    renderPhotos();
    setupEventListeners();
    hideLoading();
}

// 渲染照片
function renderPhotos() {
    photoContainer.innerHTML = '';
    
    currentPhotos.forEach((photo, index) => {
        const photoItem = createPhotoItem(photo, index);
        photoContainer.appendChild(photoItem);
    });
}

// 创建照片元素
function createPhotoItem(photo, index) {
    const div = document.createElement('div');
    div.className = 'photo-item';
    div.draggable = true;
    div.dataset.index = index;
    
    div.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}" loading="lazy">
        <div class="photo-info">
            <div class="photo-title">${photo.title}</div>
            <div class="photo-date">${formatDate(photo.date)}</div>
        </div>
    `;
    
    // 添加点击事件
    div.addEventListener('click', () => openPhotoViewer(photo));
    
    // 添加拖拽事件
    setupDragEvents(div);
    
    return div;
}

// 格式化日期
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 设置拖拽事件
function setupDragEvents(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}

let draggedElement = null;

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement !== this) {
        const draggedIndex = parseInt(draggedElement.dataset.index);
        const targetIndex = parseInt(this.dataset.index);
        
        // 交换数组中的位置
        [currentPhotos[draggedIndex], currentPhotos[targetIndex]] = [currentPhotos[targetIndex], currentPhotos[draggedIndex]];
        
        // 重新渲染
        renderPhotos();
    }
    
    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedElement = null;
}

// 设置事件监听器
function setupEventListeners() {
    // 关闭照片查看器
    closeBtn.addEventListener('click', closePhotoViewer);
    photoViewer.addEventListener('click', (e) => {
        if (e.target === photoViewer) {
            closePhotoViewer();
        }
    });
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePhotoViewer();
        }
    });
    
    // 按钮事件
    shuffleBtn.addEventListener('click', shufflePhotos);
    autoPlayBtn.addEventListener('click', toggleAutoPlay);
    resetBtn.addEventListener('click', resetPhotos);
}

// 打开照片查看器
function openPhotoViewer(photo) {
    viewerImage.src = photo.src;
    caption.textContent = `${photo.title} - ${formatDate(photo.date)}`;
    photoViewer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭照片查看器
function closePhotoViewer() {
    photoViewer.classList.remove('active');
    document.body.style.overflow = '';
}

// 随机排序照片
function shufflePhotos() {
    // Fisher-Yates 洗牌算法
    for (let i = currentPhotos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentPhotos[i], currentPhotos[j]] = [currentPhotos[j], currentPhotos[i]];
    }
    
    renderPhotos();
    
    // 添加动画效果
    document.querySelectorAll('.photo-item').forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('shuffle-animation');
            setTimeout(() => item.classList.remove('shuffle-animation'), 600);
        }, index * 50);
    });
}

// 重置照片顺序
function resetPhotos() {
    currentPhotos = [...photos];
    renderPhotos();
}

// 切换自动播放
function toggleAutoPlay() {
    if (isAutoPlay) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

// 开始自动播放
function startAutoPlay() {
    isAutoPlay = true;
    autoPlayBtn.textContent = '⏸️ 停止播放';
    autoPlayBtn.classList.add('active');
    
    let currentIndex = 0;
    
    autoPlayInterval = setInterval(() => {
        if (currentIndex >= currentPhotos.length) {
            currentIndex = 0;
        }
        
        openPhotoViewer(currentPhotos[currentIndex]);
        currentIndex++;
        
        // 3秒后自动关闭查看器
        setTimeout(() => {
            if (isAutoPlay) {
                closePhotoViewer();
            }
        }, 3000);
        
    }, 4000);
}

// 停止自动播放
function stopAutoPlay() {
    isAutoPlay = false;
    autoPlayBtn.textContent = '▶️ 自动播放';
    autoPlayBtn.classList.remove('active');
    
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    
    closePhotoViewer();
}

// 隐藏加载动画
function hideLoading() {
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);
}

// 图片加载错误处理
function handleImageError(img) {
    img.onerror = null;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZGRkIi8+CiAgICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTQiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD4KPC9zdmc+';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 添加一些额外的交互效果
document.addEventListener('DOMContentLoaded', () => {
    // 鼠标悬停效果增强
    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('.cursor');
        if (!cursor) {
            const cursorDiv = document.createElement('div');
            cursorDiv.className = 'cursor';
            cursorDiv.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                transition: transform 0.1s ease;
            `;
            document.body.appendChild(cursorDiv);
        }
    });
    
    // 随机背景色变化
    setInterval(() => {
        if (!isAutoPlay) {
            const hue = Math.random() * 360;
            document.body.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 60%) 0%, hsl(${hue + 60}, 70%, 50%) 100%)`;
        }
    }, 10000);
});

// 添加触摸支持（移动设备）
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    if (!photoViewer.classList.contains('active')) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 如果滑动距离足够大，关闭查看器
    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        closePhotoViewer();
    }
});