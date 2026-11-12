
const reviewForm = document.getElementById("reviewForm");
const reviewList = document.getElementById("reviewList");

const STORAGE_KEY = "penilaianLaptop";

// Mengambil semua penilaian
function getReviews() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

// Menampilkan semua penilaian
function tampilkanReview() {
    const reviews = getReviews();

    reviewList.innerHTML = "";

    if (reviews.length === 0) {
        reviewList.innerHTML = `
            <p class="empty-review">
                Belum ada penilaian dari customer.
                Jadilah customer pertama yang memberikan penilaian!
            </p>
        `;
        return;
    }

    reviews.forEach(review => {
        const item = document.createElement("div");
        item.className = "review-item";

        const nama = document.createElement("h4");
        nama.textContent = review.nama;

        const bintang = document.createElement("div");
        bintang.className = "review-stars";
        bintang.textContent =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        const komentar = document.createElement("p");
        komentar.textContent = review.komentar;

        const tanggal = document.createElement("div");
        tanggal.className = "review-date";
        tanggal.textContent = review.tanggal;

        item.append(nama, bintang, komentar, tanggal);
        reviewList.appendChild(item);
    });
}

// Menyimpan penilaian baru
reviewForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const komentar = document.getElementById("komentar").value.trim();

    const rating = document.querySelector(
        'input[name="rating"]:checked'
    );

    if (!nama || !komentar || !rating) {
        alert("Silakan lengkapi nama, bintang, dan komentar!");
        return;
    }

    const reviews = getReviews();

    const reviewBaru = {
        id: Date.now(),
        nama: nama,
        rating: Number(rating.value),
        komentar: komentar,
        tanggal: new Date().toLocaleString("id-ID")
    };

    // Masukkan komentar terbaru di urutan pertama
    reviews.unshift(reviewBaru);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

        alert("Terima kasih! Penilaian berhasil dikirim.");

        reviewForm.reset();

        // Langsung tampilkan komentar baru
        tampilkanReview();

    } catch (error) {
        alert("Penilaian gagal disimpan. Penyimpanan browser mungkin penuh.");
    }
});

// Sinkronisasi antar-tab pada browser yang sama
window.addEventListener("storage", function(event) {
    if (event.key === STORAGE_KEY) {
        tampilkanReview();
    }
});

// Tampilkan semua komentar ketika halaman dibuka
tampilkanReview();

