import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatThousandSeparator } from './formatterInputNumber'
import dayjs from 'dayjs'
import { capitalizeEachWord } from './capitalizeEachWord'
import { imageToBase64 } from './imageToBase64'
import hrs from '@/assets/images/hrs.png'

export async function generatePdfFromArray(
  data,
  fileName = 'data.pdf',
  title = 'Data Table',
  downloadedBy = 'Unknown user',
) {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('data must be an array')
    return
  }

  // ---- Convert imported logo to base64 ----
  const logo = await imageToBase64(hrs)

  const doc = new jsPDF({
    orientation: 'landscape',
  })

  const totalPagesExp = '{total_pages_count_string}'
  const downloadDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const formattedFilename = `${fileName}_${dayjs().format('YYYYMMDDHHmmss')}.pdf`

  // ---- 1. Title ----
  doc.setFontSize(14)
  doc.text(title, 14, 15)

  // ---- 2. Logo (space-between with title) ----
  const pageWidth = doc.internal.pageSize.width
  const margin = 14

  // hitung logo position
  const logoWidth = 20
  const logoHeight = 7
  const logoX = pageWidth - margin - logoWidth

  const logoY = 10
  doc.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight)

  // ---- 3. Headers & Rows ----
  const headers = Object.keys(data[0])
  const rows = data.map(item =>
    headers.map(key => {
      const val = item[key]

      if (typeof val === 'number') return formatThousandSeparator(val)
      if (val === null || val === undefined) return ''
      return val
    }),
  )

  // ---- 4. Generate table ----
  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: rows,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [38, 77, 142] },
    theme: 'grid',

    didDrawPage: dataArg => {
      const pageHeight = doc.internal.pageSize.height

      // Footer text
      const footerLeft = `Downloaded at: ${downloadDate} | User: ${capitalizeEachWord(downloadedBy)}`
      const pageNumberText =
        'Page ' + doc.internal.getNumberOfPages() + ' of ' + totalPagesExp

      doc.setFontSize(8)

      // Footer Left (user + date)
      doc.text(footerLeft, dataArg.settings.margin.left, pageHeight - 5)

      // Footer Right (page number)
      doc.text(
        pageNumberText,
        doc.internal.pageSize.width - dataArg.settings.margin.right - 20,
        pageHeight - 5,
      )
    },
  })

  // ---- 5. Total Data below table ----
  const finalY = doc.lastAutoTable.finalY || 30
  doc.setFontSize(10)
  doc.text(`Total Data: ${data.length}`, 14, finalY + 5)

  // ---- 6. Replace total pages placeholder ----
  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp)
  }

  // ---- 7. Save PDF ----
  doc.save(formattedFilename)
}
