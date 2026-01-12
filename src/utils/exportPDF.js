import { jsPDF } from 'jspdf';

export async function exportLayoutToPDF(levels) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  let isFirstPage = true;

  for (const level of levels) {
    if (!isFirstPage) {
      pdf.addPage();
    }
    isFirstPage = false;

    // Add level name as title
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text(level.name, 20, 20);

    // Add background image if exists
    if (level.backgroundImage) {
      try {
        const img = await loadImage(level.backgroundImage);
        const imgWidth = 250;
        const imgHeight = (img.height / img.width) * imgWidth;
        pdf.addImage(level.backgroundImage, 'PNG', 20, 30, imgWidth, imgHeight);
      } catch (error) {
        console.error('Error adding background image:', error);
      }
    }

    // Add device labels
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');

    let yOffset = level.backgroundImage ? 160 : 40;

    pdf.text('Devices:', 20, yOffset);
    yOffset += 7;

    if (level.devices.length === 0) {
      pdf.setTextColor(128, 128, 128);
      pdf.text('No devices on this level', 25, yOffset);
      pdf.setTextColor(0, 0, 0);
    } else {
      level.devices.forEach((device, index) => {
        const deviceInfo = `${index + 1}. ${device.type} - ${device.name}`;
        const position = ` @ (${Math.round(device.x)}, ${Math.round(device.y)})`;

        pdf.text(deviceInfo, 25, yOffset);
        pdf.setTextColor(100, 100, 100);
        pdf.text(position, 25, yOffset + 4);
        pdf.setTextColor(0, 0, 0);

        yOffset += 10;

        // Add extra page if we run out of space
        if (yOffset > 180 && index < level.devices.length - 1) {
          pdf.addPage();
          yOffset = 20;
          pdf.setFontSize(16);
          pdf.text(`${level.name} (continued)`, 20, yOffset);
          yOffset += 10;
          pdf.setFontSize(10);
        }
      });
    }

    // Add footer
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Generated on ${new Date().toLocaleString()}`,
      20,
      190
    );
    pdf.setTextColor(0, 0, 0);
  }

  // Save the PDF
  pdf.save(`garage-layout-${Date.now()}.pdf`);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
