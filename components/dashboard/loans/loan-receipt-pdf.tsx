import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { LoanSession } from '../locations/types';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#1e293b',
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    color: '#1e293b',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 4,
    letterSpacing: 2,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 9,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 140,
    fontSize: 10,
    color: '#475569',
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: '#1e293b',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 80,
  },
  signatureBlock: {
    width: 200,
    textAlign: 'center',
  },
  signatureLine: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 4,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#64748b',
  },
  receiptId: {
    position: 'absolute',
    top: 40,
    right: 40,
    fontSize: 8,
    color: '#94a3b8',
  }
});

interface LoanReceiptPDFProps {
  loan: LoanSession;
  adminName?: string;
}

export const LoanReceiptPDF = ({ loan, adminName = "System Administrator" }: LoanReceiptPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.receiptId}>TRX-ID: {loan.id.toUpperCase()}</Text>
      
      <View style={styles.header}>
        <Text style={styles.title}>Tanda Terima Peminjaman</Text>
        <Text style={styles.subtitle}>PHYSICAL RECORDS MANAGEMENT SYSTEM (PRMS)</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informasi Arsip</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Judul Arsip</Text>
          <Text style={styles.value}>: {loan.recordTitle}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kode Arsip</Text>
          <Text style={styles.value}>: {loan.recordCode}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detail Transaksi</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Nama Peminjam</Text>
          <Text style={styles.value}>: {loan.borrowerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ID Karyawan</Text>
          <Text style={styles.value}>: {loan.borrowerId}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Waktu Penyerahan</Text>
          <Text style={styles.value}>: {loan.loanDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimasi Pengembalian</Text>
          <Text style={styles.value}>: {loan.dueDate}</Text>
        </View>
      </View>

      {loan.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Keterangan</Text>
          <Text style={{ fontSize: 10, color: '#475569', lineHeight: 1.5 }}>{loan.notes}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>Diserahkan Oleh,</Text>
          <View style={styles.signatureLine}>
            <Text style={{ fontSize: 10 }}>{adminName}</Text>
            <Text style={styles.signatureLabel}>Petugas Arsip</Text>
          </View>
        </View>

        <View style={styles.signatureBlock}>
          <Text style={styles.signatureLabel}>Diterima Oleh,</Text>
          <View style={styles.signatureLine}>
            <Text style={{ fontSize: 10 }}>{loan.borrowerName}</Text>
            <Text style={styles.signatureLabel}>Peminjam</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
