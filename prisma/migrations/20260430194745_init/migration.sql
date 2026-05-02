-- CreateTable
CREATE TABLE "Barang" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kode_sku" TEXT NOT NULL,
    "nama_barang" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "jumlah_stok" INTEGER NOT NULL,
    "lokasi_rak" TEXT NOT NULL,
    "tanggal_masuk" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Barang_kode_sku_key" ON "Barang"("kode_sku");
