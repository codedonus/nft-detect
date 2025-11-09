# Beyond Image Similarity: Textual-Visual Synergy for Counterfeit Detection in NFT Markets

Anonymous Author(s)

## Abstract

Terbukanya pasar Non-Fungible Token (NFT) telah menciptakan peluang baru bagi seniman digital tetapi juga memicu krisis pemalsuan yang meluas yang menyesatkan konsumen dalam skala besar. Metode deteksi sebelumnya berfokus hampir secara eksklusif pada kesamaan gambar, mengabaikan peran penting data tekstual. Melalui studi empiris terperinci pertama tentang aktivitas pemalsuan di pasar NFT, kami menemukan bahwa 98% NFT palsu mengandalkan peniruan tekstual, menetapkan teks sebagai vektor serangan utama daripada metadata tambahan. Untuk mengatasi tantangan ini, kami memperkenalkan kerangka kerja verifikasi dua tahap yang menjembatani kesenjangan antara deteksi keyakinan tinggi dan intervensi platform yang dapat ditindaklanjuti. Passive Collection Filter (PCF) dengan cepat menandai aset mencurigakan dengan mencocokkan judul dan deskripsi, memungkinkan penyaringan lintas rantai (cross-chain) dan pra-rilis yang skalabel. Active Counterfeit Verifier (ACV) kemudian menghasilkan sidik jari gaya khusus koleksi untuk mengidentifikasi kemungkinan barang asli dan mendukung tindakan penghapusan. Evaluasi pada kumpulan data eksklusif mengkonfirmasi efektivitas desain kami: PCF mencapai akurasi 92% dengan throughput tinggi, sementara ACV mempertahankan akurasi 88% di seluruh koleksi dengan berbagai ukuran. Bersama-sama, modul-modul ini memberikan percepatan 50x lipat dibandingkan pemeriksaan visual per-item tradisional, tanpa mengorbankan kualitas deteksi. Studi kami menetapkan analisis berbasis teks sebagai landasan deteksi pemalsuan NFT dan menyediakan kerangka kerja yang skalabel untuk mengamankan ekosistem seni digital.

## Keywords

Non-Fungible Tokens (NFTs), Deteksi Pemalsuan, Keamanan Web3, Analisis Multimodal Tekstual-Visual, Kepercayaan Berpusat pada Konsumen

-----

**ACM Reference Format:**
Anonymous Author(s). 2025. Beyond Image Similarity: Textual-Visual Synergy for Counterfeit Detection in NFT Markets. In. ACM, New York, NY, USA, 12 pages. [https://doi.org/10.1145/nnnnnnn.nnnnnnn](https://doi.org/10.1145/nnnnnnn.nnnnnnn)

**Permission to make digital or hard copies of all or part of this work for personal or classroom use is granted without fee provided that copies are not made or distributed for profit or commercial advantage and that copies bear this notice and the full citation on the first page. Copyrights for components of this work owned by others than the author(s) must be honored. Abstracting with credit is permitted. To copy otherwise, or republish, to post on servers or to redistribute to lists, requires prior specific permission and/or a fee. Request permissions from permissions@acm.org.**
Conference' 17, Washington, DC, USA
2025 Copyright held by the owner/author(s). Publication rights licensed to ACM.
ACM ISBN 978-x-xxxx-xxxx-x/YYYY/MM
[https://doi.org/10.1145/nnnnnnn](https://doi.org/10.1145/nnnnnnn) nnnnnnn

-----

## 1 Introduction

Paradigma Web2, yang didominasi oleh platform terpusat, membatasi kontrol pencipta atas kepemilikan dan monetisasi digital. Teknologi Web3—terutama Non-Fungible Tokens (NFTs)—memperkenalkan alternatif terdesentralisasi, yang memungkinkan pencipta untuk menerbitkan sertifikat keaslian on-chain dan secara langsung melibatkan audiens global [3]. Inovasi ini telah memungkinkan ekonomi seni digital yang berkembang pesat tetapi juga memicu pemalsuan yang merajalela. Hingga 80% NFT di pasar utama adalah plagiat atau penipuan [4], yang menyebabkan kerugian jutaan dolar [19]. Pemalsuan semacam itu mengikis kepercayaan pasar dan membahayakan kredibilitas ekosistem kreatif yang terdesentralisasi.

Kerangka kerja deteksi yang ada gagal mengatasi tantangan ini secara efektif karena mereka tetap berakar pada asumsi kepercayaan terpusat Web2. Untuk pemalsuan non-native, sistem deteksi sering mengandalkan pembuatan profil perilaku, biasanya menggunakan graph neural networks (GNNs), untuk mengidentifikasi pelaku yang mencurigakan atau pola transaksi abnormal [5, 13, 29, 34, 43]. Namun, sistem semacam itu mudah dihindari oleh penyerang yang mengoperasikan akun Sybil atau meniru perilaku yang tidak berbahaya. Untuk pemalsuan native, strategi yang dominan bergantung pada verifikasi berbasis konten melalui convolutional neural networks (CNNs), perceptual hashing, atau pengambilan gambar berbasis embedding [2, 17, 26, 32, 41]. Metode-metode ini menimbulkan biaya komputasi yang tinggi karena perbandingan berpasangan yang mendalam di ruang fitur berdimensi tinggi dan kesulitan untuk berkembang seiring dengan pertumbuhan pesat pasar NFT. Lebih kritis lagi, kedua paradigma tersebut memiliki premis yang cacat: mereka mengasumsikan bahwa aset yang dicetak (minted) pertama kali adalah asli. Meskipun didahulukan secara temporal mungkin berlaku di ekosistem Web2 yang dikurasi, hal itu runtuh dalam pengaturan Web3 yang tanpa izin, di mana pemalsu dapat mencetak replika sebelum pencipta yang sah.

Keterbatasan inti dari pendekatan ini terletak pada ketidakselarasan antara model kepercayaan Web2 dan lingkungan terbuka Web3. Sistem tradisional secara implisit mengejar tujuan yang mustahil untuk memberantas semua aset palsu, daripada meminimalkan kerugian konsumen yang nyata. Kami menganjurkan pergeseran paradigma—dari klasifikasi menyeluruh ke perlindungan konsumen yang ditargetkan. Alih-alih membuat katalog setiap aset palsu, sistem deteksi harus fokus pada identifikasi dan penghentian rantai pemalsuan yang paling menipu yang menimbulkan risiko nyata bagi pengguna. Pembingkaian ulang ini mengubah verifikasi keaslian NFT dari tugas klasifikasi yang berpusat pada aset yang sulit ditangani menjadi masalah perlindungan presisi yang berpusat pada konsumen.

Untuk memahami di mana penipuan konsumen terjadi, kami menganalisis lalu lintas di pasar NFT utama, termasuk OpenSea [23] dan Rarible [28]. Lebih dari 86% sesi penemuan berasal dari pencarian berbasis teks, sementara 98% koleksi palsu mereplikasi atribut tekstual—nama, tag, atau deskripsi—dari yang sah (Gambar 1). Temuan ini menunjukkan bahwa teks adalah antarmuka utama konsumen dan senjata utama penyerang. Dengan demikian, deteksi pemalsuan yang efektif harus dimulai dengan menilai potensi penipuan dari metadata tekstual sebelum meningkat ke verifikasi tingkat konten yang lebih menuntut secara komputasi.

Untuk mengatasi tantangan ini, kami mengusulkan kerangka kerja deteksi dua tahap yang terdiri dari Passive Collection Filter (PCF) dan Active Counterfeit Verifier (ACV). PCF berfungsi sebagai filter front-end ringan yang melakukan penilaian risiko tekstual secara real-time. Ini mengukur sejauh mana metadata tekstual NFT—nama, slogan, atau tagnya—dapat menyesatkan konsumen, dengan memanfaatkan prinsip-prinsip dari psikologi kognitif seperti Distinctiveness, Familiarity, dan Gist Trace Retention [24, 27, 30]. Ini menghasilkan Textual Imprint,

-----

# Halaman 2

).]

skor risiko yang dapat ditafsirkan yang menangkap seberapa kuat metadata NFT membangkitkan pengenalan konsumen. Eksperimen kami menunjukkan korelasi yang kuat antara skor ini dan dampak dunia nyata dari serangan pemalsuan (§5), memungkinkan peringatan risiko latensi rendah yang dapat dijelaskan.

Melengkapi PCF, ACV melakukan verifikasi tingkat konten yang efisien melalui pembuatan Tailored Fingerprint untuk setiap koleksi NFT. Mengambil dari dimensi yang sudah mapan dari analisis seni dan gambar [21], seperti warna, tekstur, komposisi, dan konten, ACV mengumpulkan fitur intra-koleksi menjadi representasi global yang ringkas. Desain ini mengeksploitasi karakteristik homogenitas gaya internal dari koleksi NFT, di mana karya seni berbagi pola visual yang konsisten sementara hanya berbeda dalam detail kecil seperti latar belakang atau aksesori. Tailored Fingerprint memungkinkan perbandingan lintas koleksi yang skalabel, mencapai cakupan lebih dari 95% di seluruh NFT berbasis gambar dan video sambil mempertahankan akurasi diskriminatif yang tinggi. Ketika diterapkan secara berjenjang, PCF dan ACV bertindak secara sinergis: PCF menyaring item berisiko rendah, sementara ACV memverifikasi kasus berisiko tinggi dengan presisi, menghasilkan percepatan 50x lipat secara keseluruhan dibandingkan dengan metode kesamaan visual berbasis deep embedding.

Kami membandingkan kemampuan fungsional kerangka kerja kami dengan model yang ada di Tabel 1.

> **Tabel 1: Functional capability comparison of detection methods (indicates supported features).**
>
> ```
> "Capability ","Ours FAISS [26] ","Sahoo [32] ","Kotzer [14] ","Liang [17] "
> "Support for Image Modality Support for Video Modality ",,"X ","✓ ", 
> "Native Counterfeit Detection Non-native Counterfeit Detection. Original Collection Localization ","X ","X ",, 
> ```
>
> *(Catatan: Data tabel dari file sumber tampaknya tidak diformat dengan baik; data tersebut direproduksi di sini persis seperti yang diekstraksi.)*

Untuk memajukan penelitian dan reproduktibilitas di masa depan, kami juga membuat dan merilis kumpulan data terkurasi skala besar pertama dari pemalsuan NFT dunia nyata. Kumpulan data terdiri dari 12.119 koleksi palsu yang berasal dari 102 koleksi asli yang terverifikasi, mencakup 701.858 gambar dan 23.682 video, bersama dengan catatan transaksi dan metadata lengkap. Sepengetahuan kami, korpus ini merupakan tolok ukur paling komprehensif untuk mempelajari NFT palsu hingga saat ini.

Kontribusi utama kami adalah sebagai berikut:

1.  Kami memperkenalkan kerangka kerja berpusat pada konsumen pertama untuk deteksi pemalsuan NFT, menggabungkan pemodelan penipuan tekstual dan verifikasi visual yang skalabel dalam desain terpadu.
2.  Kami mengusulkan arsitektur dua tahap: Passive Collection Filter (PCF) memperkenalkan Textual Imprint untuk mengukur risiko penipuan, sementara Active Counterfeit Verifier (ACV) memperkenalkan Tailored Fingerprint untuk verifikasi tingkat konten yang efisien.
3.  Kami membuat dan merilis kumpulan data terkurasi terbesar dari pemalsuan NFT dunia nyata hingga saat ini, yang mencakup 12.221 koleksi palsu dan lebih dari 725.540 aset multimedia 1.
4.  Eksperimen ekstensif menunjukkan bahwa kerangka kerja kami mencapai akurasi 92% dalam penyaringan tekstual (PCF), akurasi 88% dalam verifikasi visual (ACV), dan peningkatan waktu proses 50x lipat dibandingkan metode dasar, sehingga mencapai skalabilitas dan interpretasi yang tinggi di lingkungan blockchain terbuka.

## 2 Related Work

### 2.1 Counterparty Identity Approaches

Upaya awal dalam deteksi pemalsuan NFT sebagian besar mengadopsi perspektif yang berpusat pada pelaku, yang bertujuan untuk mengidentifikasi entitas jahat melalui analisis perilaku on-chain [20]. Tidak seperti deteksi penipuan token-yang-dapat-dipertukarkan—di mana verifikasi nama kontrak atau penelusuran likuiditas mungkin cukup [45]—ekosistem NFT menimbulkan tantangan unik karena ketergantungan konten off-chain dan platform tampilan yang heterogen. Das et al. [4] memelopori pendekatan berbasis aturan yang menganalisis perilaku transaksi untuk mengungkap kerentanan di pasar NFT utama. Membangun fondasi ini, penelitian selanjutnya telah memperluas teknik deteksi anomali on-chain klasik ke NFT, menggunakan pengelompokan data [34], analisis korelasi [18, 48], dan model berbasis jaringan saraf seperti arsitektur convolutional [15, 38] untuk identifikasi penipuan.

Aliran pekerjaan terkait berfokus pada identifikasi alamat berbahaya, dengan asumsi bahwa risiko pemalsuan dapat disimpulkan dari profil pembuat atau perilaku jaringan [39]. Di sini, para peneliti sering merepresentasikan transaksi cryptocurrency sebagai multigraf terarah yang diatribusikan, dan memanfaatkan graph neural networks (GNNs) untuk mendeteksi akun anomali dan hubungan perdagangan [1, 5, 13]. Studi lain memperluas cakupan analitis di luar blockchain, menggabungkan sinyal perilaku off-chain seperti aktivitas media sosial penerbit atau promotor NFT [8, 31, 36]. Meskipun model-model ini mencapai kinerja yang baik dalam pengaturan yang dikurasi atau semi-terawasi, ketahanan mereka di lingkungan yang bermusuhan tetap terbatas. Penyerang yang canggih dapat dengan mudah membuat akun Sybil atau meniru pola transaksi yang tidak berbahaya, sehingga menghindari heuristik perilaku dan merusak keandalan jangka panjang dari deteksi berbasis identitas.

-----

# Halaman 3

### 2.2 Content Similarity Approaches

Melengkapi metode yang berpusat pada pelaku, jalur penelitian dominan lainnya berpusat pada deteksi berbasis konten, membandingkan kesamaan visual metadata NFT dan karya seni digital terkait. Prototipe awal seperti NFT-Finder, dan layanan komersial seperti Yakoa³ dan Optic, mengoperasionalkan prinsip ini dengan terus memindai dan mengindeks aset NFT baru. Dari perspektif teknis, metode kesamaan konten umumnya dibagi menjadi tiga kategori utama. Yang pertama menggunakan algoritma hashing gambar—termasuk perceptual hashing (pHash) [14, 46], difference hashing [10], dan deep perceptual hashing [35]—untuk secara efisien mengidentifikasi karya seni yang hampir duplikat. Yang kedua menggunakan model deep learning seperti Convolutional Neural Networks (CNNs) [17], Siamese Networks [47], dan EfficientNet-B0 [25], mengekstraksi embedding fitur berdimensi tinggi untuk menangkap kesamaan semantik yang terlewatkan oleh hash sederhana. Pendekatan ketiga dan paling intensif secara komputasi memperlakukan deteksi pemalsuan sebagai tugas klasifikasi biner end-to-end, secara langsung memasukkan gambar mentah ke dalam satu atau lebih model saraf untuk memutuskan keaslian [26, 32, 33].

Meskipun efektif pada kumpulan data kecil atau statis, pendekatan ini menghadapi tantangan skalabilitas dan latensi yang parah di pasar dunia nyata. Mengingat bahwa sebagian besar NFT berbasis gambar [11], perbandingan berpasangan yang mendalam di jutaan aset dengan cepat menjadi penghalang secara komputasi.

## 3 Preliminaries and Problem Setup

Bagian ini memberikan konteks penting untuk kerangka kerja kami. Kami pertama-tama merangkum struktur operasional karya seni digital NFT dan mekanisme yang memungkinkan verifikasinya (§3.1). Kami kemudian menganalisis lanskap ancaman pemalsuan, termasuk insiden representatif dan pengamatan empiris (§3.2), dan akhirnya memformalkan model permusuhan yang digunakan di seluruh studi ini (§3.3). Di seluruh makalah ini, koleksi-NFT mengacu pada satu set karya seni digital yang terdiri dari metadata tekstual dan file media terkait.

### 3.1 NFT Ecosystem Overview

Teknologi Blockchain memungkinkan otentikasi karya seni digital dengan menghubungkannya ke alamat kriptografi tertentu melalui catatan transaksi yang tidak dapat diubah. NFT memperluas kemampuan ini dengan berfungsi sebagai sertifikat keaslian dan kepemilikan on-chain, yang diatur oleh kontrak pintar. Satu set NFT yang diterbitkan di bawah satu kontrak merupakan koleksi-NFT [40].

Setiap koleksi-NFT biasanya terdiri dari tiga komponen utama: (1) Kontrak Pintar untuk mendefinisikan operasi seperti memperbarui metadata, dan mentransfer; (2) Metadata untuk menjelaskan atribut NFT dan tautan ke asetnya; dan (3) File Media Off-chain untuk menyimpan konten digital—gambar, atau video di sistem penyimpanan publik. Meskipun desain ini memastikan transparansi dan aksesibilitas global, desain ini juga mengekspos kerentanan mendasar: penyerang dapat dengan bebas mengunduh, mereplikasi, dan mengunggah ulang karya seni digital atau metadatanya untuk membuat salinan yang menipu. Sifat terbuka dan tanpa izin dari ekosistem blockchain dengan demikian membuat pasar NFT secara inheren rentan terhadap pemalsuan skala besar.

### 3.2 Counterfeit Threat Landscape

Pasar NFT beroperasi dalam kondisi asimetri informasi, di mana pembeli tidak dapat dengan mudah memverifikasi keaslian aset pada saat transaksi. Tanpa sertifikasi otoritatif atau pemeriksaan asal-usul yang wajib, koleksi palsu dan asli ada bersama-sama, merusak kepercayaan pasar. Fenomena ini mencerminkan masalah "pasar lemon" klasik dalam ekonomi, di mana barang berkualitas rendah mengikis premi kredibilitas barang asli.

Kami memformalkan konsep orisinalitas berdasarkan teori kepercayaan ekonomi sebagai berikut.

**Theorem 1 (Original NFT-Collections).** Misalkan $K$ adalah koleksi-NFT yang telah ada selama lebih dari $x$ tahun, memiliki volume perdagangan tahunan melebihi $y$, dan tidak memiliki sengketa kepemilikan. Misalkan $Pr(Fake | K)$ menunjukkan probabilitas bahwa $K$ adalah palsu. Maka ada konstanta kecil $0 < \epsilon \ll 1$ sedemikian rupa sehingga:

$Pr(Fake | K) < \epsilon$.

**PROOF.** Jika $K$ mempertahankan volume perdagangan tahunan di atas 524 selama tiga tahun berturut-turut, maka $Pr(Fake|K) < 10^{-6}$. Penurunan terperinci disediakan di Apendiks A.

Π

Membangun di atas Teorema 1, kami memeriksa kasus pemalsuan dunia nyata antara 2021 dan 2024. Kami merangkum perkiraan kerugian finansial di tiga kategori serangan utama, diukur dengan keberhasilan penipuan konsumen (lihat Tabel 5 di Apendiks B). Contoh-contoh seperti CloneX (0xD3a5) dan Bored Ape Yacht Club (0x691e) menggambarkan dua pola umum: pemalsuan native yang dicetak di rantai yang sama dengan aslinya, dan pemalsuan non-native yang dicetak di lintas rantai atau sebelum rilis. Insiden penting terjadi pada akhir 2022, ketika lonjakan NFT Reddit memicu kampanye imitasi skala besar di OpenSea. Penyerang mereplikasi elemen tekstual dan visual dari koleksi yang diverifikasi, menyebabkan transaksi penipuan melebihi USD 2 juta sebelum intervensi. Demikian pula, pada tahun 2023, Yuga Labs—pencipta BAYC—berhasil menggugat pencipta "RR/BAYC" atas pelanggaran merek dagang [16], menggarisbawahi konvergensi tantangan teknis dan hukum yang berkembang dalam keaslian NFT.

### 3.3 Threat Model and Attack Formalization

Kami memodelkan musuh $A$ yang mampu meluncurkan serangan pemalsuan native atau non-native. Setiap koleksi-NFT $K$ terdiri dari komponen tekstual $K^{Str}$ (nama, deskripsi, URL) dan komponen karya seni digital $K^{Art}=\{k_{1},k_{2},...,k_{n}\}$. Musuh diasumsikan memiliki akses ke kumpulan data komprehensif dari koleksi yang terdaftar di blockchain (B) dan koleksi yang didistribusikan di web (A), dan dapat dengan bebas mencetak NFT baru di blockchain mana pun.

**Forgery Capabilities.** Musuh melakukan dua jenis pemalsuan utama: (1) **String Counterfeiting** ($Str$ Counterfeit), dilambangkan sebagai $f_{\mathcal{A}}^{Str}:(K_{S},K_{O})\mapsto(\mathfrak{R},K_{O})$ di mana N menunjukkan metadata tekstual dari koleksi sumber $K_{S}$ yang dijiplak dan dilampirkan ke koleksi target $K_{0}$ yang baru dicetak (2) **Art Counterfeiting** ($Art$ Counterfeit), dilambangkan sebagai $f_{A}^{Art}:k\mapsto\hat{k}$ di mana $k$ adalah karya seni asli dan $\hat{k}$ adalah padanannya yang dipalsukan. Dalam praktiknya, kedua bentuk tersebut sering digabungkan untuk memaksimalkan penipuan.

**Attack Scenarios.** Berdasarkan analisis empiris dan pemodelan penyerang, kami mengidentifikasi dua skenario utama: (1) **Native Counterfeit Attacks.** Mengingat blockchain $B_{i}$, penyerang membuat koleksi palsu $\overline{K}$ dengan memanipulasi $K\in\mathbb{B}_{t}$ yang ada melalui $f_{A}^{SU}$, $f_{R}^{Ar}$, atau keduanya. Set palsu yang dihasilkan $\tilde{F}$ ada bersama dengan koleksi asli dan seringkali dapat dideteksi melalui perbandingan stempel waktu dan analisis kesamaan konten. (2) **Non-native Counterfeit Attacks.** Sebagai alternatif, penyerang mengeksploitasi koleksi yang sah $K\in A$ (di luar blockchain tempat ia pertama kali diterbitkan) untuk memalsukan

-----

# Halaman 4

koleksi palsu $\hat{K}$ menggunakan $f_{A}^{Str}$ dan/atau $f_{A}^{Art}$. Pemalsuan tersebut kemudian digunakan di blockchain yang berbeda, menyesatkan pengguna untuk memperlakukan $\hat{K}$ sebagai asli karena tidak adanya catatan on-chain sebelumnya.

## 4 Methodology

Sub-bagian ini pertama-tama menyajikan arsitektur keseluruhan dari Kerangka Kerja deteksi pemalsuan (§4.1), diikuti oleh deskripsi modul PCF (§4.2) dan ACV (§4.3).

### 4.1 Detection Framework

Untuk mengurangi kemungkinan penipuan konsumen dan meningkatkan ambang batas biaya-manfaat bagi penyerang, kami mengusulkan kerangka kerja deteksi dua tahap yang berpusat pada konsumen. Kerangka kerja deteksi yang diusulkan memperkenalkan dua modul terkoordinasi di tingkat platform: Passive Collection Filter (PCF) dan Active Counterfeit Verifier (ACV). Mengingat koleksi-NFT $K_{O}$, kerangka kerja deteksi pertama-tama memanggil PCF untuk menentukan apakah $K_{O}$ menunjukkan karakteristik mencurigakan yang dapat menyesatkan pengguna selama proses pembelian. PCF mengidentifikasi Textual Imprint koleksi-NFT, yang kami definisikan sebagai atribut semantik paling menonjol yang mengkodekan jangkar kognitif yang dikaitkan pengguna dengan koleksi target. Jika hasil PCF ditandai sebagai mencurigakan, sistem memanggil ACV untuk melakukan analisis Tailored Fingerprint pada set sampel karya seni digital $K_{O}$. Jika kecocokan kesamaan yang signifikan terdeteksi, ACV mengembalikan bukti pemalsuan yang meyakinkan dan menelusurinya kembali ke koleksi-NFT asli K, mendukung penghapusan, pelabelan, dan penegakan akuntabilitas.

### 4.2 Passive Collection Filter (PCF)

Kami beralih dari pendekatan image-centric konvensional dan sebaliknya menganalisis pemalsuan dari perspektif perilaku interaksi konsumen. Investigasi empiris kami mengungkapkan bahwa baik pengguna maupun pasar sangat bergantung pada informasi tekstual, saat mencari atau membeli aset (§4.2.1). Karena metadata tekstual secara inheren dapat diakses lintas rantai, metadata ini menyediakan titik masuk yang kuat dan skalabel untuk deteksi lintas rantai. Membangun wawasan ini, kami memperkenalkan konsep Textual Imprint—representasi dari fitur tekstual inti yang paling efektif membangkitkan pengenalan konsumen atas koleksi-NFT target (§4.2.2). Dengan menggabungkan Textual Imprint dengan landasan teoretis yang didirikan dalam Teorema 1, metode kami mendeteksi serangan pemalsuan native dan non-native, memungkinkan penyaringan pasif di lingkungan lintas rantai dan off-chain (§4.2.3).

#### 4.2.1 Counterfeit Correlation Analysis.

Di pasar NFT, pengguna terutama mengandalkan informasi struktural, seperti nama NFT, konten karya seni, dan tag deskriptif, untuk mengenali aset dan membuat keputusan pembelian. Ketika NFT yang baru terdaftar menunjukkan kesamaan struktural yang kuat dengan koleksi yang ada, pengguna mungkin disesatkan untuk menganggap aset tersebut sebagai asli dan menyelesaikan transaksi penipuan. Kesamaan ini berasal dari kemampuan pemalsuan musuh, $f_{a}^{St}$ dan $f_{a}^{Art}$ yang masing-masing memanipulasi metadata tekstual dan karya seni digital.

Analisis empiris kami menguji preferensi penyerang untuk strategi ini dan pola ko-okurensinya. Kami menemukan bahwa $f_{H}^{SH}$ terjadi jauh lebih sering dan sering ada bersama dengan $f_{A}^{Art}$ dalam kasus pemalsuan yang diamati, sedangkan pemalsuan murni berbasis karya seni (hanya mengandalkan $f_{a}^{Art}$) relatif jarang. Ini menunjukkan bahwa pemalsuan tekstual tidak hanya lazim tetapi juga sinergis dengan imitasi visual, menjadikannya komponen penting dari penipuan. Mengingat taktik penyerang dan perilaku akses konsumen, keberadaan fitur tekstual struktural yang dihasilkan oleh $f_{A}^{Str}$ memberikan indikator utama aktivitas pemalsuan, terlepas dari apakah serangan itu native atau non-native.

Analisis statistik lebih lanjut mendukung wawasan ini: di antara sampel palsu yang dibuat melalui $f_{dt}^{Art}$, 98% juga menggabungkan peniruan tekstual melalui $f_{A}^{Sur}$, termasuk nama, deskripsi, atau struktur tag yang dikloning (Gambar 1). Dominasi serangan $Str$ Counterfeit secara fundamental terkait dengan pola akses konsumen di platform NFT utama. Menurut laporan NFT-MARKET [22], sekitar 99% dari total lalu lintas pasar terkonsentrasi pada empat platform—OpenSea, Blur, Rarible, dan X2Y2—yang semuanya mengindeks dan merekomendasikan konten terutama melalui metadata tekstual seperti nama koleksi, tag kata kunci, dan URL slug. Data lalu lintas pelengkap dari Similarweb [42] menunjukkan bahwa lebih dari 86% pengguna mengakses platform NFT secara langsung melalui domain utama, sementara hanya sekitar 11% yang datang melalui tautan eksternal ke halaman NFT tertentu (Gambar 2). Pola akses ini menunjukkan bahwa pengguna sebagian besar menavigasi pasar NFT melalui pencarian internal dan sistem rekomendasi, menggarisbawahi peran sentral informasi tekstual dalam penemuan aset dan penipuan konsumen.

-----

# Halaman 5

#### 4.2.2 Risk Scoring via Consumer Textual Imprint.

Dibandingkan dengan komponen karya seni $K^{Art}$, komponen teks struktural $K^{Str}$ dari koleksi-NFT sering disebarluaskan di saluran publik seperti Twitter dan Discord selama fase pra-peluncuran, membuatnya sangat mudah diakses oleh konsumen dan musuh. Namun, mendeteksi pemalsuan yang dihasilkan oleh $f_{\mathcal{R}}^{Str}$ melalui pencocokan kesamaan teks yang mendalam tidak mungkin dilakukan secara komputasi untuk data skala besar dan berkembang secara dinamis dalam pengaturan waktu nyata. Dari perspektif konsumen, memprioritaskan tayangan tekstual yang menonjol—seperti nama koleksi, slogan, atau kata kunci visibilitas tinggi, dapat secara signifikan meningkatkan efisiensi dan akurasi deteksi sambil memenuhi persyaratan latensi penyaringan waktu nyata.

Mengambil wawasan dari psikologi kognitif, kami mendefinisikan Textual Imprint $\mathfrak{R}$ dari koleksi-NFT sebagai subset elemen tekstual yang berfungsi sebagai jangkar kognitif dalam pengenalan merek. Secara formal, $\mathfrak{R}$ harus memenuhi tiga properti berikut:

  * **A1 (Distinctiveness).** Menurut hubungan frekuensi-memori berbentuk U, juga dikenal sebagai Word Frequency Paradox [27], istilah yang muncul dengan frekuensi sangat tinggi atau sangat rendah dalam kampanye cenderung kurang dipertahankan dalam memori.
  * **A2 (Familiarity).** Didasarkan pada Mere Exposure Effect [24], kata-kata yang berulang di berbagai promosi lebih mungkin diingat dan disukai oleh pengguna.
  * **A3 (Gist Trace Retention).** Mengikuti Fuzzy-Trace Theory [30], istilah-istilah kompleks mungkin dilupakan secara harfiah tetapi cenderung meninggalkan jejak inti (gist traces) yang tahan lama, yang membentuk pembentukan kesan dan memengaruhi keputusan di kemudian hari.

Berdasarkan prinsip-prinsip ini, kami menghitung Textual Imprint $\mathfrak{R}$ untuk koleksi-NFT tertentu. Misalkan $K^{Art}=\{w_{1},w_{2},...,w_{N}\}$ merepresentasikan set lengkap token tekstual yang terkait dengan koleksi $K$. Selama fase pra-peluncuran, $K$ menghasilkan satu set teks promosi $T=\{b_{1},b_{2},...,b_{n}\}$, di mana setiap $b_{i}$ sesuai dengan konten posting promosi ke-i. Untuk memenuhi A1 dan A2, kami mendefinisikan fungsi frekuensi kata $Freq(w,T)=\sum_{t\in T}Count(w,t)$ di mana $Count(w,t)=1$ jika kata $w$ muncul dalam teks $t$, dan 0 sebaliknya. Untuk menggabungkan A3, kami lebih lanjut mengintegrasikan entropi bahasa alami. Untuk sebuah kata $w$, probabilitas kemunculannya dalam korpus referensi $C$ adalah $p(w)=\frac{f(w)}{\Sigma\omega^{\prime}\kappa C}f(w^{\prime})}$, dan entropinya didefinisikan sebagai $H(w)=-log_{2}p(w)$. Kami kemudian mendefinisikan skor tayangan kata $\Gamma_{w}$ sebagai:

$$\Gamma_{w}=\frac{Freq(w,T)\cdot H(w)\cdot g}{L\cdot(1+H(w))\cdot[1+(log(m/Q)-\mu)^{2}]} \quad (1)$$

di mana $\mu=\frac{1}{|V|}\Sigma_{u\in V}log(\frac{m_{u}}{q})$ $\mathfrak{R}$ menunjukkan frekuensi istilah $w$ dalam $K^{Art}$, $m$ mewakili frekuensi total $w$ dalam korpus, $Q$ adalah ukuran korpus, $L$ menunjukkan jumlah paparan atau tayangan, dan $g$ adalah faktor penyesuaian berbasis entropi yang memodulasi bobot kekhasan. Setelah normalisasi, kami memperoleh set skor tayangan kata $\mathfrak{R}_{K}=\{w_{1}^{K},w_{2}^{K},...,w_{n}^{K}\}$ untuk koleksi $K$, di mana $n$ mencerminkan granularitas yang diinginkan untuk deteksi pasif.

Mengingat koleksi-NFT kandidat $K_{O}=\{x_{1},x_{2},...,x_{m}\}$, kami mendefinisikan $I(w_{i}^{K},K_{O})$ sebagai fungsi indikator yang mengembalikan 1 jika $w_{i}^{K}\in\mathfrak{R}$ muncul dalam komponen tekstual apa pun dari $K_{O}$, dan 0 sebaliknya. Nilai risiko tekstual $\beta$ dari $K_{O}$ kemudian dihitung sebagai:

$$\beta=\frac{\sum_{i=1}^{m}I(w_{i}^{K},K_{O})\cdot\Gamma(w_{i}^{K})}{\sum_{i=1}^{n}\Gamma(w_{i}^{K})} \quad (2)$$

Koleksi-NFT diklasifikasikan sebagai $Str$ Counterfeit dan ditandai sebagai berisiko tinggi jika skor risiko tekstual yang dihitung memenuhi $\beta\ge0.65$ relatif terhadap koleksi asli $K_{S}$.

#### 4.2.3 Counterfeit Passive Detection.

Teknik pencocokan string tradisional tidak cukup melawan taktik penghindaran tekstual yang canggih seperti serangan homoglyph (misalnya, mengganti "o" Latin dengan "o" Kiril). Serangan ini mengeksploitasi persepsi visual daripada pengkodean karakter, menipu konsumen melalui manipulasi grafis yang halus. Untuk mengatasi ini, kami mengkonseptualisasikan ulang kesamaan teks sebagai masalah pengenalan pola visual. Pendekatan kami pertama-tama mengubah string teks menjadi representasi gambar biner untuk menangkap struktur grafis mereka. Kami kemudian menggunakan Siamese Neural Network (SNN) [44] dengan bobot bersama $W$ untuk mempelajari fungsi pemetaan $f_w$ yang memproyeksikan teks-teks ini ke dalam gambar di ruang embedding berdimensi rendah. Kesamaan visual antara dua gambar yang dipetakan, $t_{1}$ dan $t_{2}$, adalah jarak Euclidean antara embedding mereka:

$$d_{E}(t_{1},t_{2},W)=||f_{W}(t_{1})-f_{W}(t_{2})||_{2} \quad (3)$$

Untuk melatih jaringan, kami mengadopsi contrastive loss yang meminimalkan jarak $d_{E}$ untuk pasangan yang mirip secara visual (misalnya, "moonbirds" vs. "moon-birds") sambil mempertahankan margin untuk pasangan yang tidak mirip. Loss didefinisikan sebagai:

$$\mathcal{L}(W)=\sum_{i=1}^{P}(1-y_{i})L_{S}(d_{E}^{t})+y_{i}L_{D}(d_{E}^{i}) \quad (4)$$

Di sini, $y_{i}=0$ untuk pasangan yang mirip dan $y_{l}=1$ untuk pasangan yang tidak mirip. Komponen loss untuk pasangan yang mirip diberikan oleh $L_{S}=(d_{E}^{l})^{2}$. Untuk pasangan yang tidak mirip, kontribusi loss $L_{D}$ didefinisikan menggunakan fungsi engsel kuadrat dengan margin $v$, dihitung sebagai $L_{D}=(max\{0,v-d_{E}^{f}\})^{2}$. Formulasi ini menghasilkan metrik kesamaan yang secara kuat selaras dengan persepsi visual manusia tentang penipuan tekstual.

Dengan mengekstraksi fitur kata dan menggunakan KD-tree untuk pencocokan cepat, kami memperoleh skor risiko tekstual $\beta$. Skor ini, yang didefinisikan dalam Persamaan 2, berfungsi sebagai indikator inti untuk penyaringan struktural tahap awal koleksi-NFT. PCF dimulai dengan menghitung skor risiko tekstual $\beta$ antara koleksi target $K_{0}$ dan set referensi $\mathbb{C}$. Jika $\beta$ melebihi ambang $\tau$, ia akan mengeluarkan $(1,K_{S})$, jika tidak $K_{0}$ diperlakukan sebagai jinak. Secara formal, fungsi keputusan didefinisikan sebagai:

$$PCF(K_{O},\mathbb{C})=\begin{cases}(0,None),&\beta<\tau\\ (1,K_{S}),&\beta\ge\tau\end{cases} \quad (5)$$

### 4.3 Active Counterfeit Verifier (ACV)

Sementara PCF memberi pengguna peringatan risiko yang tepat waktu, mengidentifikasi dan melokalisasi koleksi-NFT sumber berdasarkan konten karya seni digital menawarkan bukti yang lebih kuat dan lebih dapat ditindaklanjuti untuk permintaan penghapusan, verifikasi kepemilikan, dan penyelesaian sengketa. Untuk mengatasi tantangan ini, kami menganalisis karakteristik struktural koleksi-NFT dan merancang algoritma ekstraksi fitur yang disesuaikan yang dioptimalkan untuk konten mereka (§4.3.1). Membangun fondasi ini, kami mengusulkan Active Counterfeit Verifier (ACV), modul deteksi yang khusus dikembangkan untuk identifikasi pemalsuan di pasar-NFT (§4.3.2), memberikan landasan teknis yang kuat untuk anti-pemalsuan seni digital.

#### 4.3.1 Tailored Fingerprint Extraction.

Satu koleksi-NFT mungkin berisi puluhan ribu karya seni (misalnya, Bored Ape Yacht Club dengan 10.000 item), menghasilkan skala pasar yang jauh melebihi seni konvensional. Karena sebagian besar koleksi dihasilkan melalui skrip otomatis, karya seni mereka menampilkan kesamaan intra-koleksi yang tinggi dalam gaya, warna, dan komposisi, dengan hanya variasi atribut kecil (misalnya, aksesori, latar belakang, ekspresi wajah). Kami mendefinisikan persyaratan desain untuk sidik jari fitur koleksi-NFT:

  * **B1 (Encoding Effectiveness).** Representasi memberikan bobot pada empat dimensi [21], yaitu, warna, tekstur, komposisi, dan konten. Dimensi yang menunjukkan diskriminasi antar-koleksi yang kuat dan varians intra-koleksi yang rendah menerima bobot yang lebih tinggi, sementara dimensi yang kurang diskriminatif diberi bobot lebih rendah.

-----

# Halaman 6

  * **B2 (Fingerprint Robustness).** Representasi harus tetap stabil di bawah gangguan umum seperti perubahan resolusi, artefak kompresi, dan transformasi geometris.

Kemudian, kami mengekstrak fitur menggunakan algoritma yang sudah mapan:

  * **Color Features ($k_{i}^{(c)}$):** Histogram warna global menangkap distribusi palet yang dominan.
  * **Texture Features ($k_{t}^{(t)}$):** Gray-Level Co-occurrence Matrices (GLCM) mengkodekan pola tekstur spasial.
  * **Composition Features ($k_{i}^{(m)}$):** Deskriptor berbasis tepi seperti HOG menangkap tata letak dan struktur spasial.
  * **Content Features ($k_{i}^{(o)}$):** CNN yang telah dilatih sebelumnya (misalnya, ResNet, VGGNet) memberikan representasi semantik tingkat tinggi.

Untuk setiap karya seni $k_{i}$, kami membuat vektor fitur komposit $\phi(k_{i})=\{k_{i}^{(c)},k_{i}^{(t)},k_{i}^{(m)},k_{i}^{(o)}\}$. Analisis pengelompokan pada koleksi-NFT asli (lihat Gambar 8 di Apendiks C) mengungkapkan bahwa kesamaan intra-koleksi tertinggi di sepanjang dimensi komposisi (m) dan konten (o), dengan keterpisahan antar-koleksi yang kuat. Oleh karena itu, algoritma ekstraksi fitur kami $F$ memprioritaskan kedua dimensi ini untuk memenuhi kriteria B1. Untuk memenuhi B2, kami membandingkan empat jenis metode ekstraksi fitur dari enam aspek berbeda (lihat Tabel 6 di Apendiks C) dan menyimpulkan bahwa pHash paling memenuhi B1 dan B2 dalam pengaturan skala besar.

Secara khusus, sidik jari global $l_{K}$ dari koleksi-NFT K didefinisikan sebagai rata-rata statistik nilai pHash di semua gambar $\Psi:K^{(Art)}\mapsto l_{K}$ di mana $l_{K}=\frac{1}{n}\sum_{i=1}^{n}pHash(k_{i})$. Meskipun $l_{K}$ secara efektif menangani NFT berbasis gambar (sekitar 85% dari pasar [11]), NFT berbasis video—mewakili sekitar 10% dan terus bertambah—memerlukan pemrosesan tambahan. Mengingat durasinya yang pendek dan struktur frame yang berulang [37], kami menerapkan ekstraksi keyframe untuk memetakan video ke dalam set frame statis, menyatukannya dengan NFT gambar di ruang sidik jari yang sama. Representasi terpadu ini mendukung proses deteksi pemalsuan selanjutnya.

#### 4.3.2 Counterfeit Active Detection.

Dalam ruang sidik jari terpadu, deteksi pemalsuan dimodelkan sebagai musuh yang menerapkan fungsi transformasi $f_{R}^{Art}$ yang mengganggu sidik jari karya seni asli $k$ untuk menghasilkan pemalsuan $\tilde{k}$. Karya seni yang dipalsukan dirancang sedemikian rupa sehingga distribusi kesamaannya jatuh dalam wilayah yang mencurigakan namun tidak meyakinkan, mempersulit klasifikasi langsung. Dalam pengaturan koleksi-NFT, strategi pemalsuan berkisar dari manipulasi eksplisit (misalnya, penyalinan langsung, penskalaan, pencerminan) hingga pemalsuan generatif laten menggunakan model AI. Serangan generatif ini memodifikasi distribusi sidik jari $\hat{k}$ agar tetap dekat dengan aslinya sambil melayang ke ambang keputusan $\alpha$, sehingga menghindari deteksi ambang tunggal—perilaku yang semakin umum dalam koleksi-NFT yang dihasilkan secara modular.

**Definition 1 (Art Counterfeit Types).** Perilaku pemalsuan dalam koleksi-NFT diklasifikasikan berdasarkan mekanisme pembuatan dan kesulitan deteksi menjadi empat kategori: (a) **Exact Duplicate** ($f_{R}^{Art_{1}}$) - Duplikasi langsung dari karya seni asli; (b) **Scaling** ($f_{\vec{H}}^{Art_{2}}$) - Pengubahan ukuran atau penskalaan sedikit dari aslinya; (c) **Mirroring** ($f_{\mathbb{R}}^{Art_{3}}$) - Pembalikan horizontal atau vertikal dari gambar asli; dan (d) **AI-Generated Style Attack** ($f_{\mathcal{R}}^{Art_{4}}$) - Gunakan model AI untuk menghasilkan gaya, komposisi, dan tekstur dari sumber.

Untuk $f_{A}^{Art_{1}}-f_{A}^{Art_{4}}$, distribusi $d(l_{k},l_{K})$ padat dengan pemisahan antar-koleksi yang jelas, memungkinkan deteksi yang andal melalui ambang $\alpha$.

Untuk menetapkan ambang deteksi yang sesuai, kami menghitung sidik jari perwakilan untuk setiap koleksi $l_{K}$ yang sah. Ambang deteksi $\alpha$ kemudian didefinisikan oleh nilai kritis yang diharapkan dari distribusi $\chi^{2}$:

$$\alpha=\mathbb{E}[\sqrt{\chi_{d,0,99}^{2}}] \quad (6)$$

di mana $\sqrt{x_{d,0,99}^{2}}$ menunjukkan nilai kritis pada tingkat kepercayaan 99% untuk $d$ derajat kebebasan. Aturan keputusan dengan demikian dirumuskan sebagai:

$$ACV(Ko. A) = \begin{cases} (1,K^*), & d(l_{k_O}, l_{K^*}) < \alpha \text{ dan } addr(K_O) \neq addr(K^*) \\ 0, & \text{lainnya} \end{cases} \quad (7)$$

di mana $K^{*}=arg~min_{K_{S}\in A}d(l_{K_{O}},l_{K_{S}})$ menunjukkan koleksi sah yang paling mirip. Jika $ACV(K_{O},A)=(1,K^{*})$, $K_{0}$ secara visual mirip dengan $K^{*}$ tetapi terletak di alamat on-chain yang berbeda, menunjukkan potensi pelanggaran yang memerlukan penghapusan dari daftar. Nilai kembali 0 menunjukkan asal-usul yang identik atau bukti aktivitas pemalsuan yang tidak mencukupi.

Dengan secara adaptif memilih dan menyetel parameter ambang batas, modul ACV yang diusulkan secara efektif mengidentifikasi dan mengklasifikasikan beragam jenis pemalsuan, memberikan deteksi yang kuat dan skalabel, serta dapat ditindaklanjuti secara hukum untuk koleksi-NFT.

## 5 Experiments

### 5.1 Datasets

Kami mengkurasi 102 koleksi-NFT asli yang diverifikasi dari daftar Rarible peringkat teratas, divalidasi silang melalui OpenSea dan NFTScan, dan disaring berdasarkan orisinalitas dan riwayat transaksi. Anotasi manual skala besar kemudian mengidentifikasi 12.221 koleksi palsu. Menggunakan API NFTScan, kami mengumpulkan metadata lengkap, menghasilkan 701.858 NFT berbasis gambar dan 23.682 NFT berbasis video dengan lebih dari 5,4 juta transaksi—kumpulan data multi-modal pemalsuan NFT terbesar dan paling ketat dianotasi hingga saat ini. Rincian lebih lanjut tentang kumpulan data yang dikumpulkan dapat dirujuk ke Tabel 4 di Apendiks B.

### 5.2 Experimental Settings

Kami mengevaluasi dua komponen inti dari kerangka kerja kami: PCF (§4.1) dan ACV (§4.2). Untuk PCF, kami membandingkan dengan metode deteksi pemalsuan tingkat string berdasarkan jarak Levenshtein yang diusulkan oleh Das et al. [4]. Eksperimen dilakukan pada kumpulan data yang berisi kasus $Str$ Counterfeit dan $Art$ Counterfeit. Untuk ACV, kami membandingkan dengan empat baseline yang diadopsi secara luas: (1) FAISS (Facebook AI Similarity Search) [26]; (2) pendekatan berbasis hash perseptual oleh Kotzer et al. [14]; (3) metode database vektor yang didorong AI oleh Sahoo et al. [32]; dan (4) model hibrida oleh Liang et al. [17] yang menggabungkan konstruksi grafis visual dengan reduksi dimensionalitas berbasis LTSA.

Pengaturan parameter dipilih melalui optimasi validasi: ambang skor risiko tekstual untuk PCF ditetapkan ke $\beta=0.65$ (dari analisis ROC), dan ambang kesamaan sidik jari untuk ACV ditetapkan ke $\alpha=20$ (Persamaan 6). Untuk NFT video, kami mengekstraksi dua hash keyframe perwakilan per aset. Untuk mensimulasikan kondisi permusuhan yang realistis, kami menerapkan dua jenis pemalsuan utama berdasarkan model ancaman kami. **Str Counterfeit:** penyerang menerapkan $f_{\mathbb{R}}^{Str}:(K_{S},K_{O})\mapsto(\mathfrak{R},K_{O})$ untuk membajak konten tekstual (misalnya, nama, kata kunci, atau deskripsi) dari koleksi sumber $K_{S}$ dan menyuntikkannya

-----

# Halaman 7

and our PCF scheme for counterfeit attack detection (larger area indicates better performance)]

ke target $K_{O}$, menyesatkan pengguna tentang asal-usul. **Art Counterfeit:** penyerang menggunakan $f_{\mathbb{R}}^{Art}:k\mapsto\overline{k}$ untuk memalsukan karya seni melalui pencerminan, pemotongan, atau penskalaan [12]. Kerangka kerja kami dievaluasi pada kumpulan data yang beragam termasuk: data yang dibuat secara sintetis untuk serangan cermin dan skala, data dunia nyata yang dihasilkan oleh AI, dan data yang mensimulasikan distribusi 90% gambar ke 10% video pasar [11]. Untuk mengevaluasi kinerja kooperatif PCF dengan metode dasar, kami menerapkan pipeline deteksi berjenjang. Modul PCF pertama-tama memproses koleksi target dan menghasilkan daftar kandidat yang diperingkat dari sumber otentik yang potensial. Modul verifikasi berikutnya, seperti ACV kami atau metode dasar lainnya, melakukan pencocokan secara eksklusif dalam set kandidat yang dikurangi ini. Jika tidak ada kecocokan yang ditemukan, ACV digunakan untuk menanyakan seluruh database. Untuk serangan native, tujuannya adalah untuk mengidentifikasi koleksi asli. Sebaliknya, untuk serangan non-native, deteksi yang berhasil hanya memerlukan penerbitan peringatan risiko yang benar daripada mengidentifikasi sumber aslinya, yang selaras dengan tujuan peringatan proaktif dari kerangka kerja kami. Semua eksperimen dijalankan pada workstation dengan CPU Intel Core i7-12650H Generasi ke-12 dan RAM DDR4 16 GB (3200 MT/s).

### 5.3 Baselines

Kami membandingkan sistem kami dengan empat baseline berbasis gambar yang representatif: FAISS [26], Sahoo et al. [32], Kotzer et al. [14], dan Liang et al. [17]. Kotzer dan Liang menghitung kecocokan hash gambar berpasangan, mengklasifikasikan deteksi berdasarkan kedekatan hash, sementara FAISS dan Sahoo menghitung kesamaan ruang-embedding antara vektor fitur. Metode-metode ini, meskipun efisien, beroperasi secara independen dari metadata yang sadar asal-usul dan tidak dapat diintegrasikan dengan PCF untuk perlindungan konsumen tahap awal atau penelusuran asal-usul. Kinerja dievaluasi menggunakan tiga metrik standar: Akurasi, Presisi, dan Skor F1.

### 5.4 Experimental Results

Model Textual Imprint dalam PCF menunjukkan kinerja yang kuat dalam mendeteksi pemalsuan berbasis teks. Seperti yang ditunjukkan pada Gambar 3, memperhitungkan interferensi visual-teks dan normalisasi homoglyph memungkinkan PCF mencapai tingkat keberhasilan 92% dalam mencocokkan judul dan deskripsi yang menipu dengan sumber aslinya. Menggunakan pengindeksan KD-tree, PCF melakukan penyaringan tekstual skala besar yang cepat, berfungsi sebagai lapisan pertahanan pertama yang efisien. Pada tahap verifikasi konten, modul ACV kami menggunakan strategi perceptual hashing (pHash) yang ditingkatkan untuk menghasilkan sidik jari tingkat koleksi yang ringkas. Untuk mengatasi sensitivitas pHash yang diketahui terhadap pencerminan, kami memperkenalkan augmentasi pencerminan selama konstruksi indeks, meningkatkan ketahanan terhadap $f_{A}^{Art_{2}}$ (penskalaan) dan $f_{R}^{Art_{3}}$ (pencerminan). Seperti yang ditunjukkan pada Tabel 6, pendekatan ini menunjukkan bahwa desain yang ringan mencapai akurasi \>80% di seluruh jenis serangan yang menantang ini, mengungguli FAISS (72%) sambil mempertahankan kinerja kueri waktu-konstan. Untuk pemalsuan gaya-generatif ($f_{R}^{Art_{4}}$), di mana semua metode berkinerja baik, ACV tetap kompetitif. Tabel 6 menyajikan evaluasi kerangka kerja PCF yang dikombinasikan dengan metode deteksi lainnya. Ketika terintegrasi, konfigurasi PCF+ACV mencapai kinerja keseluruhan tertinggi, meningkatkan akurasi deteksi setidaknya 2% di bawah serangan yang dihasilkan AI, pencerminan, penskalaan, dan simulasi dunia nyata. Selain itu, ketika digabungkan dengan beberapa metode dasar, konfigurasi berbasis PCF memberikan target yang diprioritaskan untuk verifikasi selanjutnya, menghasilkan peningkatan akurasi lebih dari 20%

-----

# Halaman 8

**Tabel 2: Performance gains of PCF-Augmented methods across diverse datasets. Best results are in bold, second-best are underlined.**

| | **Native counterfeit attack** | | | | **Non-native counterfeit attack** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Methods** | **Al-generated attack** | | | | **Mirroring attack** | | | | **Scaling attack** | | | | **90% PNG+ 10% GIF/MP4** | | |
| | Acc | Pre | F1 | T(ms) | Acc | Pre | F1 | T(ms) | Acc | Pre | F1 | T(ms) | Acc | Pre | F1 | T(ms) |
| ACV | 0.89 | 1.00 | 0.90 | 38 | 0.88 | 1.00 | 0.89 | 39 | 0.80 | 1.00 | 0.80 | 30 | 0.88 | 1.00 | 0.89 | 45 |
| **PCF+ACV** | **0.93** | **1.00** | **0.94** | **30** | **0.91** | **1.00** | **0.93** | **28** | **0.84** | **1.00** | **0.85** | **20** | **0.90** | **1.00** | **0.92** | **23** | **1.00** | **1.00** | **1.00** | **0.85** |
| Liang [17] | 0.62 | 0.54 | 1.00 | 1490 | 0.46 | 0.22 | 1.00 | 1401 | 0.82 | 1.00 | 0.40 | 1255 | 0.60 | 1.00 | 0.48 | 1333 | | | | |
| PCF+Liang | 0.87 | 1.00 | 0.90 | 71 | 0.81 | 0.53 | 0.81 | 74 | 0.82 | 1.00 | 0.82 | 84 | 0.87 | 1.00 | 0.88 | 108 | 1.00 | 1.00 | 1.00 | 0.83 |
| Kotzer [14] | 0.12 | | | 1149 | 0.11 | | | 1321 | 0.13 | | | 1296 | 0.14 | | | 1456 | - | | | |
| PCF+Kotzer | 0.50 | | | 312 | 0.48 | | | 356 | 0.48 | | | 325 | 0.48 | | | 375 | 1.00 | 1.00 | 1.00 | 0.88 |
| FAISS [26] | 0.72 | | | 114 | 0.72 | | | 156 | 0.72 | | | 146 | 0.69 | | | 156 | | | | |
| Sahoo [32] | 0.72 | | | 235 | 0.72 | | | 252 | 0.72 | | | 241 | 0.66 | | | 251 | | | | |

**Tabel 3: Top textual Imprint scores of NFT-Collections**

| Last four digits of address | \#1(1) | \#2(1) | \#3(1) | \#4(1) |
| :--- | :--- | :--- | :--- | :--- |
| Oxf15d | ape(0.0789) | bored (0.0553) | yacht(0.0401) | club (0.0343) |
| Oxf940 | beanz0 1106) | beansofficial(0.0307) | kappa(0.0059) | happy(0.0059) |
| 0x544 | azuki(0.1253) | anime(0.0197) | charity(0.0064) | community(0.0058) |
| 0x2 | pudgys(0.1235) | lil(0.1075) | pudgy(0.1016) | igloos(0.0834) |
| 0x370 | lazy(0.0680) | lions (0.0453) | lazylionanft(0.0365) | lion(0.0114) |

dan pengurangan waktu lebih dari 50%. Sebagai pra-filter yang ditargetkan, PCF secara efektif mempersempit kumpulan kandidat dan meningkatkan presisi tahap verifikasi ACV.

Dalam hal efisiensi, ACV menyelesaikan kueri dalam \~38 ms, diaktifkan oleh pencarian hash waktu-konstan (Gambar 4-5). Pada kumpulan data yang melebihi 20.000 item, pipeline PCF+ACV penuh mencapai percepatan 50x lipat dibandingkan baseline berbasis vektor paling lambat, mengkonfirmasi skalabilitas dan penerapan waktu nyatanya.

### 5.5 Case Study

Mengikuti Persamaan 1, kami memberi peringkat semua elemen tekstual berdasarkan skor tayangan mereka $\Gamma_{w}$ (Tabel 3). Menggunakan Persamaan 2, kami menghitung skor risiko $\beta$ untuk setiap koleksi dan mengkategorikan tingkat keparahan pemalsuan berdasarkan volume penjualan kembali: dapat diabaikan (\<10), kecil $(10\le n<100)$, sedang $(100\le n<1000)$, dan parah (\> 1000). Seperti yang ditunjukkan pada Gambar 6, $\beta$ berkorelasi positif dengan dampak pemalsuan: skor risiko tekstual yang lebih tinggi sesuai dengan tingkat keparahan viktimisasi yang lebih besar. Kurva memuncak di dekat $\beta\approx0.5\sim0.7$ sebelum menurun, menunjukkan bahwa pemalsuan yang sangat mirip dengan cepat dihapus dari daftar oleh platform, mengurangi kerusakan hilir. Inspeksi manual terhadap kasus-$\beta$ tinggi mengkonfirmasi bahwa sementara jejak tetap ada di on-chain, koleksi terkait tidak lagi terlihat secara publik di pasar utama seperti OpenSea.

## 6 Conclusion and Future Work

Studi ini menyajikan investigasi sistematis pertama tentang dinamika pemalsuan di pasar NFT yang terdesentralisasi, menjembatani teori ekonomi dan analisis teknis. Mengambil dari Model Perkolasi Informasi, kami memformalkan orisinalitas di bawah kepemilikan terdistribusi dan memperkenalkan taksonomi jenis serangan pemalsuan. Untuk mengurangi penipuan dan kerugian ekonomi, kami mengusulkan kerangka kerja deteksi dua tahap yang mengintegrasikan penilaian risiko tekstual (PCF) dan verifikasi konten (ACV). Kerangka kerja kami secara efektif mengidentifikasi pemalsuan native (on-chain) dan non-native (lintas rantai, pra-rilis), mencapai percepatan 50x lipat dibandingkan baseline yang ada dan cakupan 95% di seluruh format gambar dan video. Eksperimen skala besar menunjukkan akurasi, skalabilitas, dan ketertelusuran yang kuat, memberikan wawasan teknis dan tata kelola untuk ekosistem Web3.

Meskipun pekerjaan ini berfokus pada deteksi algoritmik, standar NFT saat ini tetap tidak selaras dengan persyaratan pembuktian hukum. Penelitian di masa depan harus mengembangkan mekanisme asal-usul native-blockchain yang mampu menghasilkan jejak audit yang dapat diterima pengadilan, seperti protokol yang dapat diverifikasi secara kriptografis untuk pembuatan, transfer, dan otentikasi kepemilikan NFT. Membangun fondasi semacam itu akan memungkinkan perlindungan kekayaan intelektual yang lebih kuat dan menumbuhkan ekosistem NFT yang lebih tepercaya, berkelanjutan, dan transparan.

-----

# Halaman 9

## References

[1] Ze Chang, Yunfei Cai, Xiao Fan Liu, Zhenping Xie, Yuan Liu, and Qianyi Zhan. 2024. Anomalous node detection in blockchain networks based on graph neural networks. Sensors 25, 1 (2024), 1.
[2] Edo Collins and Sabine Süsstrunk. 2019. Deep Feature Factorization for Content-Based Image Retrieval and Localization. In 2019 IEEE International Conference on Image Processing (ICIP), 874-878. doi:10.1109/ICIP.2019.8802980
[3] HEIDI Cooke. 2024. Making art, making value online: NFTs, Blockchains and online art economies. Journal of the Anthropological Society of Oxford 16 (2024).
[4] Dipanjan Das, Priyanka Bose, Nicola Ruaro, Christopher Kruegel, and Giovanni Vigna. 2022. Understanding Security Issues in the NFT Ecosystem. In Proceedings of the 2022 ACM SIGSAC Conference on Computer and Communications Security (Los Angeles, CA, USA) (CCS '22). Association for Computing Machinery, New York, NY, USA, 667-681. doi:10.1145/3548606.3559342
[5] Zhihao Ding, Jieming Shi, Qing Li, and Jiannong Cao, 2024. Effective Illicit Account Detection on Large Cryptocurrency MultiGraphs. arXiv:2309.02460 [cs.LG] [https://arxiv.org/abs/2309.02460](https://arxiv.org/abs/2309.02460)
[6] Darrell Duffie, Gaston Giroux, and Gustavo Manso. 2010. Information percolation. American Economic Journal: Microeconomics 2, 1 (2010), 100-111.
[7] Darrell Duffie and Gustavo Manso. 2007, Information percolation in large markets. American Economic Review 97, 2 (2007), 203-209.
[8] Youssef Elmougy and Ling Liu. 2023. Demystifying Fraudulent Transactions and Illicit Nodes in the Bitcoin Network for Financial Forensics. In Proceedings of the 29th ACM SIGKDD Conference on Knowledge Discovery and Data Mining (Long Beach, CA, USA) (KDD 23). Association for Computing Machinery, New York, NY, USA, 3979-3990. doi:10.1145/3580305.3599803
[9] Entrupy Inc. 2024. State of the Fake Report 2024. [https://www.entrupy.com/](https://www.entrupy.com/) report/state-of-the-fake-report-2024/. Accessed: 2025-06-10.
[10] Ricardo Fitas, Bernardo Rocha, Valter Costa, and Armando Sousa 2021. Design and comparison of image hashing methods: A case study on cork stopper unique identification. Journal of Imaging 7, 3 (2021), 48.
[11] Global Market Statistics. 2025. NFT Art Market Size, Share, Growth, and Industry Analysis, By Type (Photos, Videos, Music, Paintings, Others), By Application (Personal Use, Commercial Use) and Regional Forecast to 2033. https://www. [globalmarketstatistics.com/market-reports/nft-art-market-11390](https://www.google.com/search?q=https://globalmarketstatistics.com/market-reports/nft-art-market-11390) Last Updated: 03 March 2025.
[12] Yash Gupta, Jayanth Kumar, and Andrew Reifers. 2022. Identifying Security Risks in NFT Platforms. arXiv:2204.01487 [cs.CY] [https://arxiv.org/abs/2204.01487](https://arxiv.org/abs/2204.01487)
[13] Hanna Kim, Jian Cui, Eugene Jang, Chanhee Lee, Yongjae Lee, Jin-Woo Chung, and Seungwon Shin. 2023. DRAINCLOG: Detecting Rogue Accounts with Illegally-obtained NFTs using Classifiers Learned on Graphs. arXiv:2301.13577 [cs.CR] [https://arxiv.org/abs/2301.13577](https://arxiv.org/abs/2301.13577)
[14] Arad Kotzer, Mostafa Naamneh, Ori Rottenstreich, and Pedro Reviriego. 2024. Detection of NFT Duplications with Image Hash Functions. In 2024 IEEE International Conference on Blockchain and Cryptocurrency (ICBC), IEEE, 1-7.
[15] Andrew Leppla, Jorge Olmos, and Jaideep Lamba. 2022. Fraud pattern detection for NFT markets. SMU Data Science Review 6, 2 (2022), 21.
[16] Stuart Levi, Eytan Fisch, Alex Drylewski, and Dan Michael 2024. Legal considerations in the minting, marketing and selling of NFTs. Available on: [https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-](https://www.globallegalinsights.com/practice-areas/blockchain-cryptocurrency-) laws-and-regulations/ (2024). [https://www.globallegalinsights.com/practice-](https://www.globallegalinsights.com/practice-) areas/blockchain-cryptocurrency-laws-and-regulations/legal-considerations- in-the-minting-marketing-and-selling-of-nfts/\#\_ednó
[17] Xiaoping Liang, Zhenjun Tang, Xianquan Zhang. Mengzhu Yu, and Xinpeng Zhang. 2024. Robust Hashing With Local Tangent Space Alignment for Image Copy Detection. IEEE Transactions on Dependable and Secure Computing 21, 4 (2024), 2448-2460. doi:10.1109/TDSC 2023.3307403
[18] Derek Liu, Francesco Piccoli, Katie Chen, Adrina Tang, and Victor Fang. 2023. Nft wash trading detection. arXiv preprint arXiv:2305.01543 (2023).
[19] Kai Ma, Ningyu He, Jintao Huang, Bosi Zhang, Ping Wu, and Haoyu Wang. 2025. Cybersquatting in Web3: The Case of NFT. arXiv preprint arXiv:2504.13573 (2025).
[20] Kai Ma, Jintao Huang, Ningyu He, Zhuo Wang, and Haoyu Wang, 2025. SoK: On the Security of Non-Fungible Tokens. Blockchain: Research and Applications (2025), 100268.
[21] Jana Machajdik and Allan Hanbury. 2010. Affective image classification using features inspired by psychology and art theory. In Proceedings of the 18th ACM international conference on Multimedia. 83-92.
[22] nftgo. 2025. Market Overview. Retrieved march 20, 2025 from [https://nftgo.io/](https://nftgo.io/) macro/market-overview
[23] OpenSea.io. 2025. OpenSea, the largest NFT marketplace. [https://opensea.io](https://opensea.io). Accessed: 2025-03-20
[24] Rocco Palumbo, Alberto Di Domenico, Beth Fairfield, and Nicola Mammarella. 2021. When twice is better than once: increased liking of repeated items in- fluences memory in younger and older adults. BMC psychology 9, 1 (2021), 25.
[25] Aji Teguh Prihatno, Naufal Suryanto, Sangbong Oh, Thi-Thu-Huong Le, and Howon Kim. 2023. NFT image plagiarism check using EfficientNet-based deep neural network with triplet semi-hard loss. Applied Sciences 13, 5 (2023), 3072.
[26] Ciprian Pungila, Darius Galis, and Viorel Negru. 2022. A New High-Performance Approach to Approximate Pattern-Matching for Plagiarism Detection in Blockchain-Based Non-Fungible Tokens (NFTs). arXiv:2205.14492 [cs.CR] [https://arxiv.org/abs/2205.14492](https://arxiv.org/abs/2205.14492)
[27] Jörn Alexander Quent. Andrea Greve, and Richard N Henson. 2022. Shape of U: The nonmonotonic relationship between object-location memory and expectedness. Psychological Science 33, 12 (2022), 2084-2097.
[28] Rarible. 2024. Rarible: Create, sell or collect digital items secured with blockchain. [https://rarible.com/](https://rarible.com/) Accessed: 2024-10-07.
[29] Jay Raval, Pronaya Bhattacharya, Nilesh Kumar Jadav, Sudeep Tanwar, Gulshan Sharma, Pitshou N. Bokoro, Mitwalli Elmorsy, Amr Tolba, and Maria Simona Raboaca. 2023. RaKSHA: A Trusted Explainable LSTM Model to Classify Fraud Patterns on Credit Card Transactions. Mathematics 11, 8 (2023). doi:10.3390/ math11081901
[30] Valerie F Reyna. 2021. A scientific theory of gist communication and misinforma- tion resistance, with implications for health, education, and policy. Proceedings of the National Academy of Sciences 118, 15 (2021), e1912441117.
[31] Sayak Saha Roy, Dipanjan Das, Priyanka Bose, Christopher Kruegel, Giovanni Vigna, and Shirin Nilizadeh. 2024. Unveiling the Risks of NFT Promotion Scams. Proceedings of the International AAAI Conference on Web and Social Media 18, 1 (May 2024), 1367-1380. doi:10.1609/icwsm.v18i1.31395
[32] Samrat Sahoo, Nitin Paul, Agam Shah, Andrew Hornback, and Sudheer Chava. 2023. The Universal NFT Vector Database: A Scaleable Vector Database for NFT Similarity Matching. arXiv:2303.12998 [cs.DB] [https://arxiv.org/abs/2303.12998](https://arxiv.org/abs/2303.12998)
[33] A Singla and M Gupta. 2023. Investigating Deep learning models for NFT classification: A Review. Scie Meta Bloc Techn 1, 1 (2023), 91-98.
[34] Mingxiao Song, Yunsong Liu, Agam Shah, and Sudheer Chava. 2023. Abnormal trading detection in the nft market. arXiv preprint arXiv:2306.04643 (2023).
[35] Xiaohan Sun and Jiting Zhou. 2022. Deep perceptual hash based on hash center for image copyright protection. IEEE Access 10 (2022), 120551-120562.
[36] Iori Suzuki, Yin Minn Pa Pa, Nguyen Thi Van Anh, and Katsunari Yoshioka. [n.d.]. DeFilntel: A Dataset Bridging On-Chain and Off-Chain Data for DeFi Token Scam Investigation. ([n. d.]).
[37] Anil Thakur, K Divya, Sahil Verma, and Maninder Kaur. 2024. NFT Marketplace: what are NFTs, and how does OpenSea succeed in acquiring the most of the NFT Space. In 2024 IEEE Ist Karachi Section Humanitarian Technology Conference (KHI-HTC), IEEE, 1-7.
[38] Aleksandar Tošić, Jernej Vičić, and Niki Hrovatin. 2025. Beyond the surface: advanced wash-trading detection in decentralized NFT markets. Financial Innovation 11, 1 (2025), 1-21.
[39] Victor von Wachter, Johannes Rude Jensen, Ferdinand Regner, and Omri Ross. 2022, NFT wash trading: Quantifying suspicious behaviour in NFT markets. In International Conference on Financial Cryptography and Data Security. Springer, 299-311.
[40] Qin Wang, Rujia Li, Qi Wang, and Shiping Chen. 2021. Non-Fungible Token (NFT): Overview, Evaluation, Opportunities and Challenges, arXiv:2105.07447 [cs.CR] [https://arxiv.org/abs/2105.07447](https://arxiv.org/abs/2105.07447)
[41] Tianfu Wang, Liwei Deng, Chao Wang, Jianxun Lian, Yue Yan, Nicholas Jing Yuan, Qi Zhang, and Hui Xiong. 2024. COMET: NFT Price Prediction with Wallet Profiling. In Proceedings of the 30th ACM SIGKDD Conference on Knowledge Discovery and Data Mining (Barcelona, Spain) (KDD 24). Association for Computing Machinery, New York, NY, USA, 589-5904. doi:10.1145/3637528.3671621
[42] Website. 2025. opensea io Website Analysis for February 2025. Retrieved march 20, 2025 from [https://www.similarweb.com/website/opensea.io/](https://www.similarweb.com/website/opensea.io/)
[43] Bryan White, Aniket Mahanti, and Kalpdrum Passi. 2022. Characterizing the OpenSea NFT Marketplace. In Companion Proceedings of the Web Conference 2022 (Virtual Event, Lyon, France) (WWW 22). Association for Computing Machinery, New York, NY, USA, 488-496. doi:10.1145/3487553.3524629
[44] Jonathan Woodbridge, Hyrum S Anderson, Anjum Ahuja, and Daniel Grant. 2018. Detecting homoglyph attacks with a siamese neural network. In 2018 IEEE Security and Privacy Workshops (SPW) IEEE, 22-28.
[45] Pengcheng Xia, Haoyu Wang, Bingyu Gao, Weihang Su, Zhou Yu, Xiapu Luo, Chao Zhang, Xusheng Xiao, and Guoai Xu. 2021. Trade or trick? detecting and characterizing scam tokens on uniswap decentralized exchange. Proceedings of the ACM on Measurement and Analysis of Computing Systems 5, 3 (2021), 1-26.
[46] Jikuan Xu, Jiamin Zhang, and Junhan Wang. 2025. Digital Image Copyright Protection and Management Approach-Based on Artificial Intelligence and Blockchain Technology. Journal of Theoretical and Applied Electronic Commerce Research 20, 2 (2025), 76.
[47] Yizhuo Zhang, Guanlei Wu, Shen Shi, and Huiling Yu. 2024. WTSM-SiameseNet: A Wood-Texture-Similarity-Matching Method Based on Siamese Networks. Information 15, 12 (2024), 808,
[48] Chenyu Zhou, Hongzhou Chen, Hao Wu, Junyu Zhang, and Wei Cai. 2024. Artemis: Detecting airdrop hunters in nft markets with a graph learning system. In Proceedings of the ACM Web Conference 2024. 1824-1834.

-----

# Halaman 10

## A Proof of Theorem 1

Kami mulai dengan memperkenalkan komponen dasar dari Model Perkolasi Informasi, yang didasarkan pada struktur pasar yang didefinisikan oleh Duffie et al. [7]. Kami mendefinisikan lingkungan pasar sebagai triplet (M, C, T), di mana:

  * $M=\{m_{original},m_{counterfeit}\}$ menunjukkan set barang, termasuk barang asli dan palsu.
  * $C=\{c_{1},c_{2},...,c_{n}\}$ mewakili set konsumen, yang masing-masing dapat mengidentifikasi keaslian barang dengan probabilitas $p$ selama transaksi.
  * $T=\{t_{1},t_{2},...,t_{y}\}$ adalah set transaksi, di mana setiap $t_{i}$ sesuai dengan peristiwa di mana konsumen membeli dan mengevaluasi barang.

Dan fungsi pengenalan konsumen $f:C\times M\rightarrow\{0,1\}$ sebagai berikut:

$$f(c,m) = \begin{cases} 1, & \text{jika c dengan benar mengidentifikasi m sebagai palsu} \\ 10, & \text{sebaliknya} \end{cases} \quad (8)$$

Kami mendefinisikan $p$ sebagai probabilitas rata-rata bahwa barang palsu diidentifikasi dengan benar oleh konsumen, dikumpulkan di semua konsumen dan semua barang:

$$p = \frac{1}{|C||M|} \Sigma_{c \in C} \Sigma_{m \in M} f(m,c) \quad (9)$$

Berdasarkan struktur ini, kami menurunkan lemma berikut dari kerangka Perkolasi Informasi [6].

**LEMMA 1 (INFORMATION PERCOLATION MODE).** Probabilitas bahwa barang palsu tetap tidak terdeteksi setelah $y$ transaksi independen diberikan oleh:

$$Pr_{Undetected}(y)=(1-p)^{y} \quad (10)$$

Oleh karena itu, probabilitas bahwa pemalsuan tetap tidak terdeteksi mendekati nol ketika $y$ mendekati tak terhingga:

$$lim_{y\rightarrow\infty}Pr_{Undetected}(y)=lim_{y\rightarrow\infty}(1-p)^{y}=0$$

Pasar NFT yang diteliti dalam pekerjaan ini pada dasarnya beroperasi sebagai pasar barang digital, menunjukkan kesamaan struktural dengan pasar klasik yang ditandai oleh asimetri informasi, seperti mobil bekas atau barang mewah. Secara khusus:

  * Pembeli tidak memiliki sarana langsung untuk memverifikasi keaslian produk.
  * Penilaian keaslian bergantung pada verifikasi pihak ketiga, mekanisme pensinyalan, atau umpan balik kolektif.

Membangun sifat komoditas koleksi-NFT, pekerjaan ini adalah yang pertama menerapkan Model Perkolasi Informasi klasik dari ekonomi untuk menguji pengenalan keaslian dalam aset digital di dalam pasar NFT.

Mengingat kurangnya kumpulan data beranotasi skala besar untuk deteksi pemalsuan di pasar NFT saat ini, kami memperkenalkan kerangka estimasi heuristik untuk memodelkan probabilitas bahwa NFT palsu pada akhirnya akan terekspos. Untuk memperkirakan parameter model kunci $p$, kami mentransfer tingkat pengenalan empiris dari pasar yang secara struktural serupa berdasarkan karakteristik mekanisme bersama. Secara khusus, kami mengadopsi data dari sektor otentikasi barang mewah. Menurut laporan Entrupy 2024, sekitar 8,8% barang, senilai total 1,4 miliar USD, diidentifikasi sebagai tidak asli [9]. Tingkat pengenalan ini, yang berasal dari evaluasi pihak ketiga yang terstandardisasi, selaras dengan mekanisme pengungkapan informasi di ekosistem NFT, seperti penandaan berbasis platform, dinamika transaksi, dan umpan balik sosial.

Untuk memperhitungkan perbedaan struktural antara otentikasi mewah dan deteksi NFT, kami memperkenalkan koefisien transfer $\gamma$, yang menangkap variasi dalam kesulitan deteksi, ketersediaan informasi, dan kompleksitas pemalsuan. Secara formal, probabilitas pengenalan di pasar NFT didefinisikan sebagai:

$$p=\gamma\cdot p_{0} \text{ dengan } \gamma\in[\gamma_{min},\gamma_{max}] \quad (12)$$

di mana $p_{0}=0.088$ adalah tingkat pengenalan referensi yang diperoleh dari laporan Entrupy tentang otentikasi produk mewah.

Kami membangun rentang $\gamma$ berdasarkan pertimbangan struktural berikut:

  * **Lower Bound ($\gamma_{min}=0.1$)** Ini mewakili opasitas ekstrem di pasar NFT, di mana verifikasi identitas lemah, intervensi platform minimal, dan paparan sosial terbatas.
  * **Upper Bound ($\gamma_{max}=1.25$)** Ini mencerminkan peningkatan verifikasi melalui asal-usul on-chain, penyaringan komunitas yang kuat, dan moderasi platform yang lebih ketat, yang berpotensi membuat otentikasi NFT bahkan lebih efektif daripada metode tradisional.

Oleh karena itu, kami menurunkan interval probabilitas pengenalan berikut untuk pasar NFT:

$$p \in [0.1 p_0, 1.25 p_0] \in [0.0088, 0.11] \quad (13)$$

**PROOF.** Misalkan $p$ adalah probabilitas pengenalan per transaksi dan $\epsilon$ adalah ambang probabilitas target untuk paparan. Probabilitas bahwa barang palsu tetap tidak terdeteksi setelah $y$ transaksi adalah $(1-p)^{y}<\epsilon$. Menyelesaikan jumlah transaksi $y$ yang diperlukan menghasilkan:

$$y>\frac{ln(\epsilon)}{ln(1-p)} \quad (11)$$

Dengan asumsi tingkat transaksi tahunan rata-rata $\lambda$, jumlah transaksi setelah $x$ tahun adalah $y=\lambda x$. Untuk probabilitas kecil $(p\ll1)$, kami menggunakan perkiraan $ln(1-p)\approx-p$. Mensubstitusikan ini ke dalam ketidaksetaraan dan menyelesaikan untuk waktu $x$ memberikan:

$$\lambda x>\frac{ln(\epsilon)}{-p} \quad x>\frac{-ln(\epsilon)}{\lambda p}=\frac{ln(1/\epsilon)}{\lambda p}.$$

Hubungan fundamental ini mengukur waktu paparan. Untuk memastikan paparan dalam durasi tetap, seperti $x=3$ tahun, dengan toleransi pemalsuan $\epsilon=10^{-6}$ (di mana $ln(1/\epsilon)\approx13.82)$, kita dapat mengatur ulang ketidaksetaraan untuk menurunkan batas bawah untuk frekuensi transaksi tahunan $\lambda$:

$$\lambda>\frac{ln(1/\epsilon)}{xp}=\frac{13.82}{3p} \quad (14)$$

Ekspresi ini menunjukkan intensitas perdagangan minimum yang diperlukan agar koleksi-NFT dengan probabilitas pengenalan $p$ terekspos dalam tiga tahun. Saat $p$ menurun, $\lambda$ yang diperlukan meningkat secara hiperbolik. Sebagai contoh:

  * Jika $p=0.0088$ maka $\lambda>\frac{13.82}{3 \cdot 0.0088}\approx524$.
  * Jika $p=0.11$, maka $\lambda>\frac{13.82}{3\cdot0.11}\approx42$.

(15)

-----

# Halaman 11

and lambda in [10, 1000]. The blue-to-black regions indicate shorter exposure times under the information percolation model. This visualization supports the hypothesis that NFT-collections with sufficiently long lifespans x and high transaction frequencies lambda have a negligible probability of being counterfeit.]

Gambar 7 mengilustrasikan hubungan terbalik ini, berfungsi sebagai referensi struktural untuk mengevaluasi apakah umur koleksi-NFT $x$ dan intensitas transaksi tahunan $A$ cukup untuk mengklasifikasikannya sebagai asli dengan tingkat kepercayaan $1-\epsilon$.

Π

## B Dataset Details

**Tabel 4: Dataset. This table outlines the key metrics of our proposed dataset, highlighting its scale and unique features.**

| Metric | Value |
| :--- | :--- |
| Number of Collections | 12 221 |
| Features: create time, blockchain, url, | address |
| Total number of NFTs | 725 540 |
| Contents: URI, metadata, image, type, | rarity |
| Total number of Transactions | 5 400 513 |
| Contents: Address, eventType, Platform | |
| Time Span (Start) | 2021-01-01 |
| Time Span (End) | 2024-09-30 |
| Collections with Infringement Labels | 12 221 |
| Asset Types (Image/Video) | 90%/10% |

Landasan kumpulan data kami adalah satu set ground-truth dari 102 koleksi NFT asli. Proses seleksi sangat ketat: setiap koleksi kandidat diharuskan untuk (1) memenuhi kriteria orisinalitas formal yang didefinisikan dalam Teorema 1 kami, dan (2) memiliki lencana verifikasi "Resmi" di platform OpenSea. Verifikasi silang ini memastikan landasan teoretis dan pengenalan pasar dunia nyata.

Menargetkan set asli ini, kami melakukan upaya pengumpulan data skala besar yang mencakup dari 2021 hingga 2024, awalnya mengumpulkan set mentah sekitar 100.000 koleksi palsu yang potensial. Dari kumpulan ini, tim kami melakukan proses anotasi manual yang teliti. Upaya ini menghasilkan subset berkualitas tinggi yang diverifikasi dari 12.119 koleksi palsu, yang dirangkum dalam Tabel 4. Yang terpenting, masing-masing koleksi ini diberi label manual dengan vektor serangan utamanya: tekstual ($Str$ counterfeit) atau visual ($Art$ counterfeit).

Untuk semua koleksi yang dikurasi, kami secara terprogram menjelajahi data on-chain dan off-chain lengkap mereka melalui NFTscan API. Proses ini melibatkan pengumpulan lebih dari 725.540 URL aset, dari mana kami berhasil mengunduh dan memproses lebih dari 200.000 aset yang valid setelah memfilter tautan mati dan duplikat. Kumpulan data akhir terdiri dari 701.858 NFT berbasis gambar dan 23.682 NFT berbasis video. Untuk mensimulasikan kondisi pasar dunia nyata, komposisi dikendalikan ke rasio gambar-ke-video sekitar 90/10. Kumpulan data lebih lanjut diperkaya dengan 5.400.513 catatan transaksi untuk mendukung analisis perilaku yang komprehensif.

Selain mengklasifikasikan jenis serangan, kami melakukan upaya signifikan untuk mengukur kerugian finansial yang disebabkan oleh setiap koleksi palsu. Untuk setiap koleksi di set palsu kami, kami secara sistematis menganalisis riwayat penjualan on-chain lengkapnya. Pendapatan dari setiap transaksi, yang awalnya dalam berbagai cryptocurrency (misalnya, ETH, MATIC), dikonversi ke ekuivalen Dolar AS berdasarkan nilai tukar pada saat penjualan. Proses ini menghasilkan anotasi penting untuk setiap koleksi palsu: total pendapatan gelapnya dalam USD. Seperti yang diilustrasikan dengan contoh-contoh di Tabel 5, data ekonomi ini memungkinkan analisis langsung dari dampak finansial dunia nyata dari vektor serangan yang berbeda, seperti pemalsuan tekstual versus visual dalam konteks native dan non-native.

## C Clustering Analysis and Feature Extraction Methods Compare

Pendekatan kami didasarkan pada hipotesis bahwa koleksi NFT generatif memiliki tanda tangan gaya yang konsisten yang dapat digunakan untuk identifikasi. Untuk memvalidasi ini dan mengidentifikasi dimensi visual yang paling menonjol, kami pertama-tama melakukan analisis eksplorasi. Kami secara acak mengambil sampel aset dari berbagai koleksi dan mengekstraksi vektor fitur yang sesuai dengan empat dimensi berbeda: warna, tekstur, komposisi, dan konten. Seperti yang diilustrasikan oleh hasil pengelompokan di Gambar 8, kami menemukan bahwa fitur komposisi dan konten menunjukkan sifat yang paling diinginkan: homogenitas tinggi dalam satu koleksi (intra-koleksi) dan varians tinggi antara koleksi yang berbeda (antar-koleksi). Ini menegaskan bahwa mereka adalah dimensi yang paling diskriminatif untuk mendefinisikan identitas visual unik koleksi.

Setelah mengidentifikasi dimensi fitur utama, kami kemudian mengevaluasi beberapa algoritma untuk kemampuan mereka mengekstrak fitur-fitur ini secara kuat dan efisien di bawah transformasi permusuhan (B2). kami mengevaluasi beberapa algoritma ekstraksi fitur, termasuk: (1) CNN untuk embedding fitur mendalam; (2) Perceptual Hashing (pHash) untuk sidik jari perseptual yang kuat yang toleran terhadap perubahan konten kecil; (3) Edge Detection Features (EDF) untuk representasi tepi struktural; dan (4) Scale-Invariant Feature Transform (SIFT) untuk deskriptor keypoint lokal yang kuat terhadap rotasi dan penskalaan. Hasilnya, dirangkum

-----

# Halaman 12

**Tabel 5: Examples of original and counterfeit NFT-Collections.**

| **Original NFT-Collection** | | **Counterfeit NFT-Collection** | | |
| :--- | :--- | :--- | :--- | :--- |
| **Name** | **Address** | **Address** | **Name** | **Chain Attack Type** |
| Bored Ape Yacht Club | 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D | 0xdh9ef424d1e2e31fbd36e09d57aa9be310de83ba | Bored Ape Yacht 3D Club | Native Counterfeit Ethereum |
| | | 0x2ee6af0dff3alce3f7e3414c52c48fd50d73691e | Bored Ape Yacht Club | Non-Native Counterfeit Base |
| | | 0x9abcd0373faf77a6e156674970081876ddf02349 | Bored Ape Ascii Club | Non-Native Counterfeit Base |
| CloneX | 0x49cfbf5d44e70224e2e23fdcdd2c053f30ada28b | 0x460c98172d107e104b7d63f4dd935d025407cf04 | Clonex Al | Native Counterfeit Ethereum |
| | | 0x78A8760F8d0DbBAf885B694A8D0072bA0a4D3a5 | CloneX | Non-Native Counterfeit Arbitrum |
| Lil Pudgys | 0x524cAB2ec69124574082676e6F654a18df49A048 | 0x426448d40478a93d70739ac1aa82a4562f57lald | Lil Baby Pudgy Penguins | Non-Native Counterfeit Ethereum |
| | | 0x551dc8cdc6b422b4ec4bacbad1661619e243b2b7 | Based Lil Pudgys | Non-Native Counterfeit Base |

**Tabel 6: Comparison of feature extraction methods in terms of robustness and complexity**

| Algorithm | Color | Texture | Composition | Content | Robustness | complexity |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| CNN | Strong | Strong | Strong | Strong | High | High |
| pHash | Strong | Moderate | Moderate | Moderate | Moderate | Low |
| EDF | Moderate | Moderate | Strong | None | Moderate | Low |
| SIFT | Moderate | Moderate | Strong | Moderate | Moderate | Moderate |
| *Legend:* | *Strong* | *Moderate* | *None* | | | |

di Tabel 6, mengungkap pertukaran yang jelas antara ketahanan dan biaya komputasi. Sementara model mendalam seperti CNN menawarkan ketahanan yang unggul, pHash memberikan keseimbangan optimal, memberikan ketahanan yang cukup terhadap serangan target kami sambil menawarkan kinerja yang luar biasa. Kemampuannya untuk memenuhi persyaratan ketahanan inti kami dengan sebagian kecil dari biaya komputasi menjadikannya pilihan definitif untuk modul ACV kami yang skalabel.

-----

Informasi relevan lebih lanjut dan hasil statistik disediakan di [https://anonymous.4open.science/r/Data-4F81](https://anonymous.4open.science/r/Data-4F81).