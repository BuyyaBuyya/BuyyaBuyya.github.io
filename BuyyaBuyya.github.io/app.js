const uploadArea = document.getElementById('upload-area');
const fileNameDisplay = document.getElementById('file-name');
const formatSelect = document.getElementById('format-select');
const convertBtn = document.getElementById('convert-btn');
let selectedFile = null;

uploadArea.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.doc,.docx,.pdf,.txt';
    fileInput.click();

    fileInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        fileNameDisplay.textContent = `Selected file: ${selectedFile.name}`;
        updateConvertButton();
    });
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#45a049';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#ccc';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    selectedFile = e.dataTransfer.files[0];
    fileNameDisplay.textContent = `Selected file: ${selectedFile.name}`;
    updateConvertButton();
});

formatSelect.addEventListener('change', updateConvertButton);

function updateConvertButton() {
    convertBtn.disabled = !(selectedFile && formatSelect.value);
}

convertBtn.addEventListener('click', () => {
    if (selectedFile && formatSelect.value) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('format', formatSelect.value);

        fetch('/convert', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) return response.blob();
            throw new Error('Conversion failed.');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `converted.${formatSelect.value}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('File conversion failed. Please try again.');
        });
    }
});