"use strict";

document.addEventListener("DOMContentLoaded", function () {
const form = document.getElementById("costForm");
const results = document.getElementById("results");
const currencySelect = document.getElementById("currency");
const rowContainers = {
    materials: document.getElementById("materialsRows"),
    labour: document.getElementById("labourRows"),
    expenses: document.getElementById("expensesRows")
};

let lastCalculation = null;
let rowCounter = 0;
let importedQuoteDate = null;
const suggestionDefaults = {
    materials: [
        "Mild steel plate", "Mild steel sheet", "Galvanized steel sheet", "Zinc-coated steel sheet",
        "Stainless steel sheet", "Stainless steel plate", "Aluminium sheet", "Aluminium plate",
        "Chequer plate", "Tread plate", "Expanded metal", "Perforated sheet", "Steel coil",
        "Flat bar", "Round bar", "Square bar", "Hex bar", "Steel angle", "Equal angle",
        "Unequal angle", "Channel iron", "C-channel", "U-channel", "I-beam", "H-beam",
        "Universal beam", "Universal column", "T-section", "Z-section", "Steel tee",
        "RHS rectangular hollow section", "SHS square hollow section", "CHS circular hollow section",
        "Steel pipe", "Galvanized pipe", "Stainless steel pipe", "Seamless pipe", "Welded pipe",
        "Round steel tube", "Square steel tube", "Rectangular steel tube", "Scaffold tube",
        "Rebar", "Welded mesh", "Reinforcing mesh", "Steel grating", "Bar grating",
        "Steel wire", "Welding wire", "MIG wire", "Flux-cored wire", "TIG filler rod",
        "Welding electrode", "Hardfacing electrode", "Mild steel welding rod",
        "Stainless steel round bar", "Stainless steel flat bar", "Stainless steel angle",
        "Stainless steel tube", "Stainless steel pipe", "Aluminium flat bar", "Aluminium round bar",
        "Aluminium angle", "Aluminium channel", "Aluminium extrusion", "Aluminium tube",
        "Copper sheet", "Copper plate", "Copper bar", "Copper tube", "Brass sheet",
        "Brass bar", "Brass tube", "Bronze bar", "Bronze bush",
        "Wear plate", "Abrasion-resistant plate", "Corten steel", "High-tensile steel",
        "Spring steel", "Tool steel", "Cast iron", "Ductile iron", "Lead sheet",
        "HDPE sheet", "UHMWPE sheet", "Nylon sheet", "Acetal sheet", "PVC sheet",
        "Acrylic sheet", "Polycarbonate sheet", "Fibreglass sheet", "Rubber sheet",
        "Plywood", "Timber", "Other material"
    ],
    labour: ["Cutting and preparation", "Welding", "Fabrication and assembly", "Grinding and finishing", "Installation"],
    expenses: [
        "Cutting discs", "Grinding discs", "Flap discs", "Wire brush discs", "Cut-off wheels",
        "Saw blades", "Bandsaw blades", "Drill bits", "Step drills", "Hole saws", "Taps and dies",
        "Welding gas", "Shielding gas", "Oxygen", "Acetylene", "Argon", "CO2 gas", "LPG",
        "Welding contact tips", "Welding nozzles", "Welding liners", "Anti-spatter spray",
        "Electrode drying", "Solder and flux", "Filler materials",
        "Abrasive belts", "Sandpaper", "Polishing compound", "Pickling paste", "Passivation fluid",
        "Paint", "Primer", "Thinners", "Protective coating", "Galvanizing", "Powder coating",
        "Fasteners", "Bolts and nuts", "Washers", "Screws", "Rivets", "Anchors", "Clamps",
        "Adhesive", "Sealant", "Threadlocker", "Gaskets", "Rubber feet", "Hinges", "Locks",
        "PPE and safety equipment", "Welding gloves", "Welding helmet consumables", "Respirator filters",
        "Workshop consumables", "Cleaning supplies", "Marking and layout supplies", "Lubricants",
        "Machine hire", "Equipment hire", "Crane hire", "Forklift hire", "Scaffold hire",
        "Tooling charge", "Machine setup charge", "Machine maintenance allocation",
        "Material handling", "Loading and unloading", "Packaging", "Protective wrapping",
        "Delivery", "Collection", "Transport", "Fuel", "Vehicle running costs", "Toll fees",
        "Courier", "Freight", "Parking",
        "Site access fee", "Travel time", "Accommodation", "Meals and incidentals",
        "Site preparation", "Installation equipment", "Waste disposal", "Scrap removal",
        "Testing and inspection", "Certification", "Non-destructive testing", "Engineering services",
        "Subcontractor", "Outsourced cutting", "Laser cutting", "Plasma cutting", "Waterjet cutting",
        "Bending service", "Machining service", "Heat treatment", "Other expense"
    ]
};
const businessSuggestionDefaults = {
    general: suggestionDefaults,
    metal: suggestionDefaults,
    wood: {
        materials: ["Hardwood", "Softwood", "Pine", "Oak", "Meranti", "Plywood", "Marine plywood", "MDF", "Moisture-resistant MDF", "Particle board", "Melamine board", "Laminated board", "Veneer", "Timber battens", "Dowel", "Wood edging", "Acrylic sheet", "Glass", "Other material"],
        labour: ["Cutting and sizing", "Planing", "Routing", "Joinery", "Cabinet assembly", "Furniture assembly", "Sanding", "Staining and finishing", "Hardware fitting", "Installation"],
        expenses: ["Wood glue", "Screws", "Nails", "Cabinet hinges", "Drawer runners", "Handles", "Wood filler", "Sandpaper", "Saw blades", "Router bits", "Varnish", "Wood stain", "Paint", "Lacquer", "Edge banding", "Packaging", "Delivery", "Machine hire", "Other expense"]
    },
    glass: {
        materials: ["Clear float glass", "Tinted glass", "Laminated glass", "Toughened glass", "Low-E glass", "Mirror", "Wired glass", "Patterned glass", "Insulated glass unit", "Glass blocks", "Aluminium glazing channel", "Other material"],
        labour: ["Site measurement", "Glass cutting", "Edge polishing", "Drilling", "Notching", "Glazing", "Frame preparation", "Removal of existing glass", "Installation", "Delivery and handling"],
        expenses: ["Glazing silicone", "Glazing tape", "Setting blocks", "Glazing wedges", "Gaskets", "Aluminium framing", "Glazing clips", "Suction cup hire", "Cutting oil", "Safety equipment", "Packaging", "Delivery", "Other expense"]
    },
    plastics: {
        materials: ["Acrylic sheet", "Perspex sheet", "Polycarbonate sheet", "PVC sheet", "HDPE sheet", "UHMWPE sheet", "ABS sheet", "Acetal sheet", "Nylon sheet", "Polypropylene sheet", "Plastic rod", "Plastic tube", "Plastic extrusion", "Other material"],
        labour: ["Plastic cutting", "CNC routing", "Laser cutting", "Plastic bending", "Heat forming", "Plastic welding", "Bonding", "Drilling and machining", "Polishing", "Assembly and installation"],
        expenses: ["Acrylic adhesive", "Plastic solvent cement", "Protective film", "Router bits", "Laser consumables", "Polishing compound", "Fasteners", "Packaging", "Delivery", "Machine hire", "Other expense"]
    },
    stone: {
        materials: ["Granite slab", "Marble slab", "Quartz surface", "Sintered stone", "Porcelain slab", "Natural stone", "Engineered stone", "Stone offcut", "Plywood substrate", "Other material"],
        labour: ["Template and measure", "Stone cutting", "CNC profiling", "Edge profiling", "Polishing", "Cut-out fabrication", "Seam preparation", "Countertop installation", "Sealing", "Removal of existing surface"],
        expenses: ["Stone adhesive", "Epoxy resin", "Stone sealer", "Diamond blade", "Grinding wheel", "Polishing pads", "Sink clips", "Brackets", "A-frame transport", "Crane or lifting hire", "Packaging", "Delivery", "Other expense"]
    },
    signs: {
        materials: ["Aluminium composite panel", "PVC foam board", "Acrylic sheet", "Perspex sheet", "Aluminium sheet", "Vinyl film", "Reflective vinyl", "Banner material", "LED strip", "Sign frame", "Timber sign board", "Other material"],
        labour: ["Artwork preparation", "CNC routing", "Vinyl cutting", "Printing", "Lamination", "Sign assembly", "LED installation", "Vehicle branding", "Onsite installation", "Removal of old signage"],
        expenses: ["Ink", "Vinyl film", "Application tape", "Lamination film", "LED modules", "Power supply", "Wiring", "Mounting brackets", "Adhesive", "Fasteners", "Scaffold hire", "Access equipment", "Delivery", "Other expense"]
    },
    upholstery: {
        materials: ["Upholstery fabric", "Leather", "Synthetic leather", "Outdoor fabric", "Curtain fabric", "Upholstery foam", "High-density foam", "Foam offcut", "Dacron batting", "Webbing", "Upholstery thread", "Piping cord", "Other material"],
        labour: ["Pattern making", "Fabric cutting", "Foam cutting", "Sewing", "Upholstery fitting", "Button tufting", "Furniture re-covering", "Curtain making", "Installation", "Collection and delivery"],
        expenses: ["Staples", "Upholstery tacks", "Zips", "Buttons", "Springs", "Webbing", "Adhesive", "Sewing machine needles", "Thread", "Dust cover fabric", "Packaging", "Delivery", "Other expense"]
    },
    composites: {
        materials: ["Fibreglass cloth", "Fibreglass mat", "Carbon fibre cloth", "Epoxy resin", "Polyester resin", "Vinyl ester resin", "Gelcoat", "Core foam", "Release film", "Vacuum bagging film", "Mould material", "Other material"],
        labour: ["Mould preparation", "Pattern making", "Laminate lay-up", "Resin infusion", "Vacuum bagging", "Curing", "Demoulding", "Trimming", "Sanding and finishing", "Repair and installation"],
        expenses: ["Catalyst", "Hardener", "Release agent", "Peel ply", "Breather fabric", "Vacuum tubing", "Mixing cups", "Sandpaper", "Respirator filters", "Protective clothing", "Packaging", "Delivery", "Other expense"]
    },
    machining: {
        materials: ["Aluminium billet", "Aluminium plate", "Aluminium round bar", "Mild steel bar", "Stainless steel bar", "Brass bar", "Copper bar", "Engineering plastic", "Cast iron", "Tool steel", "Other material"],
        labour: ["CNC milling", "CNC turning", "Manual milling", "Manual turning", "Drilling and boring", "Grinding", "EDM machining", "Setup and programming", "Deburring", "Inspection and finishing"],
        expenses: ["Cutting tools", "End mills", "Turning inserts", "Drill bits", "Coolant", "Cutting oil", "Workholding", "Tooling charge", "Machine setup", "Heat treatment", "Surface finishing", "Calibration and inspection", "Packaging", "Delivery", "Other expense"]
    }
};
const suggestionStorageKey = "nivto-fabrication-suggestions-v1";
const companyStorageKey = "nivto-fabrication-company-profile-v1";
const companyFieldIds = [
    "businessType", "companyName", "companyEmail", "companyPhone", "companyAddress", "companyRegistration", "companyTaxNumber",
    "companyBankName", "companyAccountName", "companyAccountNumber", "companyBranchCode", "companyPaymentReference",
    "invoiceTaxRate", "invoiceDueDays"
];
const quoteFormFieldIds = [
    "jobReference", "customerName", "customerCompany", "customerEmail", "customerPhone", "customerAddress",
    "currency", "quoteValidity", "jobDescription", "wastePercent", "overheadPercent", "markupPercent"
];

if (!form) {
    console.error('Calculator form not found. Check that index.html contains id="costForm".');
    return;
}

function numberValue(id, fallback = 0) {
    const element = document.getElementById(id);

    if (!element || element.value.trim() === "") {
        return fallback;
    }

    const value = Number(element.value);
    return Number.isFinite(value) ? value : NaN;
}

function currency() {
    return currencySelect && currencySelect.value
        ? currencySelect.value
        : "ZAR";
}

function money(value) {
    return new Intl.NumberFormat("en-ZA", {
        style: "currency",
        currency: currency(),
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function showMessage(message, isError = false) {
    let box = document.getElementById("calculatorMessage");

    if (!box) {
        box = document.createElement("p");
        box.id = "calculatorMessage";
        box.setAttribute("role", "status");
        form.appendChild(box);
    }

    box.textContent = message;
    box.style.color = isError ? "#b91c1c" : "#166534";
}

function addLineItem(kind, values = {}) {
    const container = rowContainers[kind];
    if (!container) return;

    rowCounter += 1;
    const row = document.createElement("div");
    row.className = "line-item-row";
    row.dataset.rowId = String(rowCounter);

    const description = document.createElement("input");
    description.type = "text";
    description.className = "line-description";
    description.maxLength = 100;
    description.placeholder = kind === "materials" ? "Choose or type material" : kind === "labour" ? "Choose or type task" : "Choose or type expense";
    description.value = values.description || "";
    description.setAttribute("aria-label", kind + " description");
    description.setAttribute("list", kind + "Suggestions");

    const dimensions = document.createElement("input");
    dimensions.type = "text";
    dimensions.maxLength = 60;
    dimensions.placeholder = kind === "materials" ? "Dimensions / grade" : "Details (optional)";
    dimensions.value = values.dimensions || "";
    dimensions.className = "line-dimensions";
    dimensions.setAttribute("aria-label", "Dimensions or details");

    const quantity = document.createElement("input");
    quantity.type = "number";
    quantity.min = "0";
    quantity.step = "0.01";
    quantity.value = values.quantity ?? (kind === "labour" ? "0" : "1");
    quantity.className = "line-quantity";
    quantity.setAttribute("aria-label", kind === "labour" ? "Hours" : "Quantity");

    const unit = document.createElement("input");
    unit.type = "text";
    unit.maxLength = 16;
    unit.placeholder = kind === "labour" ? "hours" : "unit (m, kg, sheet)";
    unit.value = values.unit || (kind === "labour" ? "hours" : "each");
    unit.className = "line-unit";
    unit.setAttribute("aria-label", "Unit");

    const rate = document.createElement("input");
    rate.type = "number";
    rate.min = "0";
    rate.step = "0.01";
    rate.value = values.rate || "0";
    rate.className = "line-rate";
    rate.setAttribute("aria-label", kind === "labour" ? "Hourly rate" : "Unit price");

    const total = document.createElement("output");
    total.className = "line-total";
    total.textContent = money(0);

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "remove-row-button";
    remove.textContent = "Remove";
    const rowLabels = { materials: "material", labour: "labour task", expenses: "expense" };
    remove.setAttribute("aria-label", "Remove " + rowLabels[kind] + " row");

    const label = document.createElement("span");
    label.className = "line-kind-label";
    label.textContent = kind === "materials" ? "MATERIAL" : kind === "labour" ? "LABOUR" : "EXPENSE";

    const fieldLabels = kind === "labour"
        ? ["Task", "Details", "Hours", "Time unit", "Rate per hour (" + currency() + ")"]
        : [kind === "materials" ? "Material" : "Expense", kind === "materials" ? "Size / grade" : "Details", "Quantity", "Unit", "Price per unit (" + currency() + ")"];

    [description, dimensions, quantity, unit, rate].forEach(function (element, index) {
        const field = document.createElement("label");
        field.className = "line-item-field";
        const caption = document.createElement("span");
        caption.textContent = fieldLabels[index];
        if (index === 4) caption.classList.add("line-rate-caption");
        field.append(caption, element);
        row.appendChild(field);
    });

    const totalField = document.createElement("div");
    totalField.className = "line-item-field line-total-field";
    const totalCaption = document.createElement("span");
    totalCaption.textContent = "Line total";
    totalField.append(totalCaption, total);
    row.appendChild(totalField);

    const actionField = document.createElement("div");
    actionField.className = "line-item-field line-action-field";
    const actionCaption = document.createElement("span");
    actionCaption.textContent = " ";
    actionField.append(actionCaption, remove);
    row.appendChild(actionField);
    container.appendChild(row);
    updateLineTotal(row);
}

function updateLineTotal(row) {
    const quantity = Number(row.querySelector(".line-quantity").value);
    const rate = Number(row.querySelector(".line-rate").value);
    const total = Number.isFinite(quantity * rate) ? quantity * rate : 0;
    row.querySelector(".line-total").textContent = money(total);
    return total;
}

function readRows(kind) {
    return Array.from(rowContainers[kind].querySelectorAll(".line-item-row")).map(function (row) {
        const quantity = Number(row.querySelector(".line-quantity").value);
        const rate = Number(row.querySelector(".line-rate").value);
        return {
            description: row.querySelector(".line-description").value.trim() || "Unspecified item",
            dimensions: row.querySelector(".line-dimensions").value.trim(),
            quantity,
            unit: row.querySelector(".line-unit").value.trim(),
            rate,
            total: quantity * rate
        };
    }).filter(item => item.description !== "Unspecified item" || item.rate > 0 || item.dimensions);
}

function calculate() {
    lastCalculation = null;
    if (results) results.hidden = true;

    const materials = readRows("materials");
    const labourTasks = readRows("labour");
    const expenses = readRows("expenses");
    const wastePercent = numberValue("wastePercent", 10);
    const overheadPercent = numberValue("overheadPercent", 10);
    const markupPercent = numberValue("markupPercent", 20);

    const inputs = [wastePercent, overheadPercent, markupPercent].concat(
        materials.concat(labourTasks, expenses).flatMap(item => [item.quantity, item.rate])
    );

    if (inputs.some(value => !Number.isFinite(value) || value < 0)) {
        showMessage("Please enter valid numbers. Values cannot be negative.", true);
        return;
    }

    if (wastePercent > 100 || overheadPercent > 100 || markupPercent > 1000) {
        showMessage("Waste and overhead must not exceed 100%, and markup must not exceed 1000%.", true);
        return;
    }

    const validityDays = numberValue("quoteValidity", 14);
    if (!Number.isInteger(validityDays) || validityDays < 1 || validityDays > 365) {
        showMessage("Quotation validity must be between 1 and 365 days.", true);
        return;
    }

    const invoiceTaxRate = numberValue("invoiceTaxRate", 0);
    const invoiceDueDays = numberValue("invoiceDueDays", 30);
    if (!Number.isFinite(invoiceTaxRate) || invoiceTaxRate < 0 || invoiceTaxRate > 100 ||
        !Number.isInteger(invoiceDueDays) || invoiceDueDays < 0 || invoiceDueDays > 365) {
        showMessage("Invoice tax must be 0-100% and payment terms 0-365 days.", true);
        return;
    }

    const allRows = materials.concat(labourTasks, expenses);
    if (allRows.some(item => item.description === "Unspecified item" && item.total > 0)) {
        showMessage("Add a description to each cost line that has a price.", true);
        return;
    }

    const material = materials.reduce((sum, item) => sum + item.total, 0);
    const materialWaste = material * wastePercent / 100;
    const materialTotal = material + materialWaste;
    const labourTotal = labourTasks.reduce((sum, item) => sum + item.total, 0);
    const other = expenses.reduce((sum, item) => sum + item.total, 0);
    const subtotal = materialTotal + labourTotal + other;
    const overhead = subtotal * overheadPercent / 100;
    const totalCost = subtotal + overhead;
    const markup = totalCost * markupPercent / 100;
    const sellingPrice = totalCost + markup;
    const profit = sellingPrice - totalCost;

    lastCalculation = {
        company: {
            businessType: document.getElementById("businessType").value,
            name: document.getElementById("companyName").value.trim(),
            email: document.getElementById("companyEmail").value.trim(),
            phone: document.getElementById("companyPhone").value.trim(),
            address: document.getElementById("companyAddress").value.trim(),
            registration: document.getElementById("companyRegistration").value.trim(),
            taxNumber: document.getElementById("companyTaxNumber").value.trim(),
            bankName: document.getElementById("companyBankName").value.trim(),
            accountName: document.getElementById("companyAccountName").value.trim(),
            accountNumber: document.getElementById("companyAccountNumber").value.trim(),
            branchCode: document.getElementById("companyBranchCode").value.trim(),
            paymentReference: document.getElementById("companyPaymentReference").value.trim()
        },
        invoiceTaxRate,
        invoiceDueDays,
        reference: document.getElementById("jobReference").value.trim(),
        customer: document.getElementById("customerName").value.trim(),
        customerCompany: document.getElementById("customerCompany").value.trim(),
        email: document.getElementById("customerEmail").value.trim(),
        phone: document.getElementById("customerPhone").value.trim(),
        customerAddress: document.getElementById("customerAddress").value.trim(),
        description: document.getElementById("jobDescription").value.trim(),
        validityDays,
        materials,
        labourTasks,
        expenses,
        material,
        wastePercent,
        materialWaste,
        materialTotal,
        labourTotal,
        other,
        subtotal,
        overheadPercent,
        overhead,
        totalCost,
        markupPercent,
        markup,
        sellingPrice,
        profit,
        calculatedAt: importedQuoteDate ? new Date(importedQuoteDate) : new Date()
    };

    displayResults(lastCalculation);
    showMessage("Quotation totals updated.");
    console.log("Calculation completed:", lastCalculation);
    return lastCalculation;
}

function setResult(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function displayResults(data) {
    setResult("baseMaterialResult", money(data.material));
    setResult("wasteResult", money(data.materialWaste));
    setResult("labourResult", money(data.labourTotal));
    setResult("otherResult", money(data.other));
    setResult("subtotalResult", money(data.subtotal));
    setResult("overheadResult", money(data.overhead));
    setResult("totalCostResult", money(data.totalCost));
    setResult("markupResult", money(data.markup));
    setResult("sellingPriceResult", money(data.sellingPrice));

    if (results) {
        results.hidden = false;
        results.style.display = "";
    }
}

function reportText(data) {
    const validUntil = new Date(data.calculatedAt);
    validUntil.setDate(validUntil.getDate() + data.validityDays);
    const lines = [
        "FABRICATION QUOTATION",
        "========================================",
        data.company.name || "Company name not provided",
        data.company.address,
        data.company.email ? "Email: " + data.company.email : "",
        data.company.phone ? "Phone: " + data.company.phone : "",
        data.company.registration ? "Registration: " + data.company.registration : "",
        data.company.taxNumber ? "Tax / VAT: " + data.company.taxNumber : "",
        "",
        "Quotation reference: " + (data.reference || "Pending reference"),
        "Date: " + data.calculatedAt.toLocaleDateString(),
        "Valid until: " + validUntil.toLocaleDateString(),
        "Currency: " + currency(),
        "Bill to: " + (data.customerCompany || data.customer || "Customer not specified"),
        data.customerCompany && data.customer ? "Attention: " + data.customer : "",
        data.customerAddress,
        data.email ? "Customer email: " + data.email : "",
        data.phone ? "Customer phone: " + data.phone : ""
    ].filter(Boolean);

    if (data.description) lines.push("\nScope of work: " + data.description);

    function appendRows(title, rows) {
        lines.push("", title, "----------------------------------------");
        rows.forEach(function (item) {
            const details = [item.description, item.dimensions, item.quantity + " " + item.unit,
                money(item.rate) + " each", money(item.total)].filter(Boolean).join(" | ");
            lines.push(details);
        });
    }

    appendRows("MATERIALS", data.materials);
    appendRows("LABOUR", data.labourTasks);
    appendRows("ADDITIONAL EXPENSES", data.expenses);
    lines.push(
        "",
        "Material waste allowance (" + data.wastePercent + "%): " + money(data.materialWaste),
        "Subtotal before overhead: " + money(data.subtotal),
        "Overhead allowance (" + data.overheadPercent + "%): " + money(data.overhead),
        "TOTAL ESTIMATED JOB COST: " + money(data.totalCost),
        "Profit markup (" + data.markupPercent + "%): " + money(data.markup),
        "SUGGESTED SELLING PRICE: " + money(data.sellingPrice),
        "",
        "This quotation is valid until " + validUntil.toLocaleDateString() + ".",
        "Thank you for the opportunity to quote.",
        "",
        "Prepared with Nivto Fabrication."
    );
    return lines.join("\n");
}

function downloadReport() {
    if (!lastCalculation) {
        showMessage("Calculate the job cost before downloading the estimate.", true);
        return;
    }

    const blob = new Blob([reportText(lastCalculation)], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "nivto-fabrication-quotation.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

function quoteFileName(data) {
    const reference = (data.reference || data.customerCompany || data.customer || "quotation")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return "nivto-quote-" + (reference || "quotation") + ".json";
}

function saveQuoteFile() {
    const data = calculate();
    if (!data) return;

    const quoteFile = {
        application: "nivto-fabrication",
        documentType: "quotation",
        version: 1,
        savedAt: new Date().toISOString(),
        company: data.company,
        invoiceDefaults: {
            taxRate: data.invoiceTaxRate,
            dueDays: data.invoiceDueDays
        },
        form: Object.fromEntries(quoteFormFieldIds.map(id => [id, document.getElementById(id).value])),
        lineItems: {
            materials: data.materials,
            labour: data.labourTasks,
            expenses: data.expenses
        },
        calculatedAt: data.calculatedAt.toISOString()
    };
    const blob = new Blob([JSON.stringify(quoteFile, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = quoteFileName(data);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showMessage("Quote file saved. Keep it to reopen this quote or create its invoice later.");
}

function validateQuoteFile(quoteFile) {
    if (!quoteFile || quoteFile.application !== "nivto-fabrication" ||
        quoteFile.documentType !== "quotation" || quoteFile.version !== 1 ||
        !quoteFile.form || typeof quoteFile.form !== "object" ||
        !quoteFile.lineItems || typeof quoteFile.lineItems !== "object") {
        throw new Error("This is not a supported Nivto Fabrication quote file.");
    }

    const validCurrencies = ["ZAR", "USD", "GBP", "EUR", "AUD"];
    if (!validCurrencies.includes(quoteFile.form.currency)) {
        throw new Error("The quote file contains an unsupported currency.");
    }

    ["materials", "labour", "expenses"].forEach(function (kind) {
        const rows = quoteFile.lineItems[kind];
        if (!Array.isArray(rows) || rows.length > 200 || rows.some(function (row) {
            return !row || typeof row.description !== "string" || typeof row.dimensions !== "string" ||
                typeof row.unit !== "string" || !Number.isFinite(row.quantity) || row.quantity < 0 ||
                !Number.isFinite(row.rate) || row.rate < 0;
        })) {
            throw new Error("The quote file has invalid " + kind + " line items.");
        }
    });

    return quoteFile;
}

function loadQuoteFile(file) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
        showMessage("Quote files must be smaller than 2 MB.", true);
        return;
    }

    file.text().then(function (text) {
        const quoteFile = validateQuoteFile(JSON.parse(text));
        form.reset();
        quoteFormFieldIds.forEach(function (id) {
            if (typeof quoteFile.form[id] === "string") document.getElementById(id).value = quoteFile.form[id];
        });

        const company = quoteFile.company || {};
        const companyValues = {
            businessType: company.businessType,
            companyName: company.name,
            companyEmail: company.email,
            companyPhone: company.phone,
            companyAddress: company.address,
            companyRegistration: company.registration,
            companyTaxNumber: company.taxNumber,
            companyBankName: company.bankName,
            companyAccountName: company.accountName,
            companyAccountNumber: company.accountNumber,
            companyBranchCode: company.branchCode,
            companyPaymentReference: company.paymentReference,
            invoiceTaxRate: quoteFile.invoiceDefaults && quoteFile.invoiceDefaults.taxRate,
            invoiceDueDays: quoteFile.invoiceDefaults && quoteFile.invoiceDefaults.dueDays
        };
        companyFieldIds.forEach(function (id) {
            if (companyValues[id] !== undefined && companyValues[id] !== null) {
                document.getElementById(id).value = String(companyValues[id]);
            }
        });
        syncBusinessTypeChecks();
        Object.keys(rowContainers).forEach(refreshSuggestions);
        saveCompanyProfile();

        Object.keys(rowContainers).forEach(function (kind) {
            rowContainers[kind].replaceChildren();
            quoteFile.lineItems[kind].forEach(function (item) {
                addLineItem(kind, item);
            });
            if (!quoteFile.lineItems[kind].length) addLineItem(kind);
        });
        importedQuoteDate = typeof quoteFile.calculatedAt === "string" &&
            Number.isFinite(Date.parse(quoteFile.calculatedAt))
            ? quoteFile.calculatedAt
            : null;
        currencySelect.dispatchEvent(new Event("change", { bubbles: true }));

        if (!calculate()) throw new Error("The quote could not be recalculated. Check the saved values.");
        showMessage("Quote opened. Check the customer details, then create an invoice when it has been accepted.");
        results.scrollIntoView({ behavior: "smooth", block: "start" });
    }).catch(function (error) {
        showMessage(error.message || "Could not read this quote file.", true);
    });
}

function createInvoice() {
    if (!lastCalculation) {
        showMessage("Open or calculate an accepted quotation before creating an invoice.", true);
        return;
    }

    const data = lastCalculation;
    const taxRate = numberValue("invoiceTaxRate", 0);
    const dueDays = numberValue("invoiceDueDays", 30);
    if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100 ||
        !Number.isInteger(dueDays) || dueDays < 0 || dueDays > 365) {
        showMessage("Invoice tax must be 0-100% and payment terms 0-365 days.", true);
        return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        showMessage("The browser blocked the invoice window. Allow pop-ups to create the invoice PDF.", true);
        return;
    }

    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + dueDays);
    const invoiceNumber = "INV-" + ((data.reference || issueDate.toISOString().slice(0, 10))
        .replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-") + "-" +
        issueDate.getTime().toString().slice(-6));
    const taxAmount = data.sellingPrice * taxRate / 100;
    const amountDue = data.sellingPrice + taxAmount;
    const doc = printWindow.document;
    doc.title = invoiceNumber;

    const style = doc.createElement("style");
    style.textContent =
        "@page{size:A4;margin:16mm}body{font-family:Arial,sans-serif;max-width:900px;margin:35px auto;padding:20px;color:#222}" +
        "h1{margin:0;color:#102944}h2{margin:26px 0 8px;font-size:16px}p{margin:5px 0}.invoice-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}" +
        ".invoice-number{font-weight:bold;text-align:right}.columns{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:25px 0}.label{color:#667085;font-size:12px;text-transform:uppercase}" +
        "table{width:100%;border-collapse:collapse;margin-top:22px}th,td{text-align:left;padding:12px;border-bottom:1px solid #ddd}th:last-child,td:last-child{text-align:right}" +
        ".totals{width:min(100%,420px);margin:18px 0 0 auto}.grand-total{font-weight:bold;font-size:1.15em}.payment{margin-top:28px;padding:16px;background:#f3f6f8}.brand-footnote{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:34px;padding-top:8px;border-top:1px solid #ddd;color:#777;font-size:10px}.brand-footnote img{width:18px;height:18px;object-fit:contain}" +
        "@media print{body{max-width:none;margin:0;padding:0}h1,h2{break-after:avoid}tr{break-inside:avoid}}";
    doc.head.appendChild(style);

    const header = doc.createElement("div");
    header.className = "invoice-heading";
    const companyBlock = doc.createElement("div");
    const companyHeading = doc.createElement("h1");
    companyHeading.textContent = data.company.name || "Invoice";
    companyBlock.appendChild(companyHeading);
    [data.company.address, data.company.email, data.company.phone,
        data.company.registration ? "Registration: " + data.company.registration : "",
        data.company.taxNumber ? "Tax / VAT: " + data.company.taxNumber : ""]
        .filter(Boolean).forEach(textValue => {
            const p = doc.createElement("p");
            p.textContent = textValue;
            companyBlock.appendChild(p);
        });
    header.appendChild(companyBlock);
    const invoiceLabel = doc.createElement("div");
    invoiceLabel.className = "invoice-number";
    const invoiceTitle = doc.createElement("h1");
    invoiceTitle.textContent = "INVOICE";
    invoiceLabel.appendChild(invoiceTitle);
    const invoiceRef = doc.createElement("p");
    invoiceRef.textContent = invoiceNumber;
    invoiceLabel.appendChild(invoiceRef);
    header.appendChild(invoiceLabel);
    doc.body.appendChild(header);

    const parties = doc.createElement("div");
    parties.className = "columns";
    const billTo = doc.createElement("div");
    const billLabel = doc.createElement("p");
    billLabel.className = "label";
    billLabel.textContent = "Bill to";
    billTo.appendChild(billLabel);
    [data.customerCompany, data.customer, data.customerAddress, data.email, data.phone]
        .filter(Boolean).forEach(textValue => {
            const p = doc.createElement("p");
            p.textContent = textValue;
            billTo.appendChild(p);
        });
    const dates = doc.createElement("div");
    [["Invoice date", issueDate], ["Due date", dueDate], ["Quote reference", data.reference || "-" ]]
        .forEach(function ([label, dateOrReference]) {
            const p = doc.createElement("p");
            p.textContent = label + ": " + (dateOrReference instanceof Date
                ? dateOrReference.toLocaleDateString()
                : dateOrReference);
            dates.appendChild(p);
        });
    parties.append(billTo, dates);
    doc.body.appendChild(parties);

    const description = doc.createElement("p");
    description.textContent = data.description || "Fabrication work as detailed in the accepted quotation.";
    doc.body.appendChild(description);
    const invoiceTable = doc.createElement("table");
    invoiceTable.innerHTML = "<thead><tr><th>Description</th><th>Qty</th><th>Amount</th></tr></thead>";
    const invoiceBody = doc.createElement("tbody");
    const invoiceRow = doc.createElement("tr");
    ["Fabrication work as quoted", "1", money(data.sellingPrice)].forEach(textValue => {
        const cell = doc.createElement("td");
        cell.textContent = textValue;
        invoiceRow.appendChild(cell);
    });
    invoiceBody.appendChild(invoiceRow);
    invoiceTable.appendChild(invoiceBody);
    doc.body.appendChild(invoiceTable);

    const totals = doc.createElement("table");
    totals.className = "totals";
    [["Subtotal", money(data.sellingPrice)], ["Tax (" + taxRate + "%)", money(taxAmount)], ["Amount due", money(amountDue)]]
        .forEach(function ([label, amount], index, rows) {
            const row = doc.createElement("tr");
            if (index === rows.length - 1) row.className = "grand-total";
            [label, amount].forEach(textValue => {
                const cell = doc.createElement(index === rows.length - 1 ? "th" : "td");
                cell.textContent = textValue;
                row.appendChild(cell);
            });
            totals.appendChild(row);
        });
    doc.body.appendChild(totals);

    const payment = doc.createElement("div");
    payment.className = "payment";
    const paymentHeading = doc.createElement("h2");
    paymentHeading.textContent = "Payment details";
    payment.appendChild(paymentHeading);
    [data.company.bankName ? "Bank: " + data.company.bankName : "",
        data.company.accountName ? "Account name: " + data.company.accountName : "",
        data.company.accountNumber ? "Account number: " + data.company.accountNumber : "",
        data.company.branchCode ? "Branch / routing code: " + data.company.branchCode : "",
        "Payment reference: " + (data.company.paymentReference || invoiceNumber)]
        .filter(Boolean).forEach(textValue => {
            const p = doc.createElement("p");
            p.textContent = textValue;
            payment.appendChild(p);
        });
    doc.body.appendChild(payment);

    const footnote = doc.createElement("div");
    footnote.className = "brand-footnote";
    const logo = doc.createElement("img");
    logo.src = new URL("icon.ico", window.location.href).href;
    logo.alt = "";
    const footnoteText = doc.createElement("span");
    footnoteText.textContent = "Prepared with Nivto Fabrication";
    footnote.append(logo, footnoteText);
    doc.body.appendChild(footnote);

    printWindow.focus();
    printWindow.setTimeout(() => printWindow.print(), 250);
}

function printReport() {
    if (!lastCalculation) {
        showMessage("Calculate the job cost before printing the estimate.", true);
        return;
    }

    const data = lastCalculation;
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
        showMessage("The browser blocked the print window. Please allow pop-ups and try again.", true);
        return;
    }

    // Build the printable report without embedding a script in its HTML.
    const doc = printWindow.document;
    doc.title = (data.company.name || "Fabrication") + " Quotation";

    const style = doc.createElement("style");
    style.textContent =
        "@page{size:A4;margin:16mm}" +
        "body{font-family:Arial,sans-serif;max-width:900px;margin:35px auto;padding:20px;color:#222}" +
        "h1{margin-bottom:5px;color:#102944}h2{margin:28px 0 8px;font-size:16px}h3{margin:20px 0 5px;font-size:13px}table{width:100%;border-collapse:collapse;margin-top:12px}" +
        "th,td{text-align:left;padding:12px;border-bottom:1px solid #ddd}" +
        "th:last-child,td:last-child{text-align:right}" +
        ".total{font-weight:bold;font-size:1.1em}.quote-meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px}.issuer-details p,.customer-details p{margin:3px 0}" +
        ".note{margin-top:25px;color:#555;font-size:13px}.brand-footnote{display:flex;align-items:center;justify-content:flex-end;gap:6px;margin-top:32px;padding-top:8px;border-top:1px solid #ddd;color:#777;font-size:10px}.brand-footnote img{width:18px;height:18px;object-fit:contain}" +
        "@media print{body{max-width:none;margin:0;padding:0}.no-print{display:none}h1,h2,h3{break-after:avoid}tr{break-inside:avoid}table{break-inside:auto}}";

    doc.head.appendChild(style);

    const heading = doc.createElement("h1");
    heading.textContent = data.company.name || "Fabrication Quotation";
    doc.body.appendChild(heading);

    const subtitle = doc.createElement("p");
    subtitle.textContent = "QUOTATION";
    doc.body.appendChild(subtitle);

    const issuerDetails = doc.createElement("div");
    issuerDetails.className = "issuer-details";
    [
        data.company.address,
        data.company.email ? "Email: " + data.company.email : "",
        data.company.phone ? "Phone: " + data.company.phone : "",
        data.company.registration ? "Registration number: " + data.company.registration : "",
        data.company.taxNumber ? "Tax / VAT number: " + data.company.taxNumber : ""
    ].filter(Boolean).forEach(function (text) {
        const item = doc.createElement("p");
        item.textContent = text;
        issuerDetails.appendChild(item);
    });
    doc.body.appendChild(issuerDetails);

    const validUntil = new Date(data.calculatedAt);
    validUntil.setDate(validUntil.getDate() + data.validityDays);
    const metadata = doc.createElement("div");
    metadata.className = "quote-meta";
    [
        "Quotation reference: " + (data.reference || "Pending reference"),
        "Date: " + data.calculatedAt.toLocaleDateString(),
        "Currency: " + currency(),
        "Valid until: " + validUntil.toLocaleDateString(),
        ""
    ].filter(Boolean).forEach(function (text) {
        const item = doc.createElement("p");
        item.textContent = text;
        metadata.appendChild(item);
    });
    doc.body.appendChild(metadata);

    const customerHeading = doc.createElement("h3");
    customerHeading.textContent = "Bill to";
    doc.body.appendChild(customerHeading);
    const customerDetails = doc.createElement("div");
    customerDetails.className = "customer-details";
    [
        data.customerCompany,
        data.customer ? (data.customerCompany ? "Attention: " : "") + data.customer : "",
        data.customerAddress,
        data.email ? "Email: " + data.email : "",
        data.phone ? "Phone: " + data.phone : ""
    ].filter(Boolean).forEach(function (text) {
        const item = doc.createElement("p");
        item.textContent = text;
        customerDetails.appendChild(item);
    });
    doc.body.appendChild(customerDetails);

    if (data.description) {
        const scope = doc.createElement("p");
        scope.textContent = "Scope of work: " + data.description;
        doc.body.appendChild(scope);
    }

    function appendTable(title, rows) {
        const sectionTitle = doc.createElement("h2");
        sectionTitle.textContent = title;
        doc.body.appendChild(sectionTitle);
        const table = doc.createElement("table");
        const header = doc.createElement("tr");
        ["Description", "Dimensions / details", "Quantity", "Unit price", "Amount"].forEach(function (label) {
            const th = doc.createElement("th");
            th.textContent = label;
            header.appendChild(th);
        });
        const thead = doc.createElement("thead");
        thead.appendChild(header);
        table.appendChild(thead);
        const tbody = doc.createElement("tbody");
        rows.forEach(function (item) {
            const row = doc.createElement("tr");
            [item.description, item.dimensions || "-", item.quantity + " " + item.unit,
                money(item.rate), money(item.total)].forEach(function (value) {
                const cell = doc.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        doc.body.appendChild(table);
    }

    appendTable("Materials", data.materials);
    appendTable("Labour", data.labourTasks);
    appendTable("Additional expenses", data.expenses);

    const totals = [
        ["Material waste allowance (" + data.wastePercent + "%)", money(data.materialWaste)],
        ["Subtotal before overhead", money(data.subtotal)],
        ["Overhead allowance (" + data.overheadPercent + "%)", money(data.overhead)],
        ["Total estimated job cost", money(data.totalCost)],
        ["Profit markup (" + data.markupPercent + "%)", money(data.markup)],
        ["Suggested selling price", money(data.sellingPrice)]
    ];
    const totalsTable = doc.createElement("table");
    totals.forEach(function (values, index) {
        const row = doc.createElement("tr");
        values.forEach(function (value) {
            const cell = doc.createElement(index === totals.length - 1 ? "th" : "td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        if (index === totals.length - 1) row.className = "total";
        totalsTable.appendChild(row);
    });
    doc.body.appendChild(totalsTable);

    const note = doc.createElement("p");
    note.className = "note";
    note.textContent = "This quotation is valid until " + validUntil.toLocaleDateString() + ". Thank you for the opportunity to quote.";
    doc.body.appendChild(note);

    const brandFootnote = doc.createElement("div");
    brandFootnote.className = "brand-footnote";
    const brandLogo = doc.createElement("img");
    brandLogo.src = new URL("icon.ico", window.location.href).href;
    brandLogo.alt = "";
    const brandText = doc.createElement("span");
    brandText.textContent = "Prepared with Nivto Fabrication";
    brandFootnote.append(brandLogo, brandText);
    doc.body.appendChild(brandFootnote);

    printWindow.focus();
    printWindow.setTimeout(function () {
        printWindow.print();
    }, 250);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    calculate();
});

form.addEventListener("click", function (event) {
    const addButton = event.target.closest("[data-add-row]");
    if (addButton) {
        addLineItem(addButton.dataset.addRow);
        calculate();
        return;
    }

    const removeButton = event.target.closest(".remove-row-button");
    if (removeButton) {
        removeButton.closest(".line-item-row").remove();
        calculate();
    }
});

form.addEventListener("input", function (event) {
    if (event.isTrusted) importedQuoteDate = null;
    const row = event.target.closest(".line-item-row");
    if (row) updateLineTotal(row);
    if (lastCalculation || row) calculate();
});

function setUpSuggestions(id, suggestions) {
    const list = document.createElement("datalist");
    list.id = id;
    suggestions.forEach(function (suggestion) {
        const option = document.createElement("option");
        option.value = suggestion;
        list.appendChild(option);
    });
    form.appendChild(list);
}

function savedSuggestions() {
    try {
        const saved = JSON.parse(localStorage.getItem(suggestionStorageKey) || "{}");
        return saved && typeof saved === "object" ? saved : {};
    } catch (error) {
        return {};
    }
}

function loadCompanyProfile() {
    try {
        const profile = JSON.parse(localStorage.getItem(companyStorageKey) || "{}");
        applyCompanyProfile(profile);
    } catch (error) {
        return;
    }
}

function applyCompanyProfile(profile) {
    companyFieldIds.forEach(function (id) {
        const field = document.getElementById(id);
        if (field && typeof profile[id] === "string") field.value = profile[id];
    });
    syncBusinessTypeChecks();
}

function readCompanyProfile() {
    return Object.fromEntries(companyFieldIds.map(id => [id, document.getElementById(id).value]));
}

function saveCompanyProfile() {
    try {
        localStorage.setItem(companyStorageKey, JSON.stringify(readCompanyProfile()));
    } catch (error) {
        showMessage("Company details could not be saved in this browser.", true);
    }
}

function saveCompanyProfileFile() {
    const profileFile = {
        application: "nivto-fabrication",
        documentType: "company-profile",
        version: 1,
        savedAt: new Date().toISOString(),
        profile: readCompanyProfile()
    };
    const blob = new Blob([JSON.stringify(profileFile, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nivto-company-profile.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    saveCompanyProfile();
    showMessage("Company profile saved. Keep this file to reuse your details on another device.");
}

function loadCompanyProfileFile(file) {
    if (!file) return;
    if (file.size > 256 * 1024) {
        showMessage("Company profile files must be smaller than 256 KB.", true);
        return;
    }

    file.text().then(function (text) {
        const profileFile = JSON.parse(text);
        if (!profileFile || profileFile.application !== "nivto-fabrication" ||
            profileFile.documentType !== "company-profile" || profileFile.version !== 1 ||
            !profileFile.profile || typeof profileFile.profile !== "object") {
            throw new Error("This is not a supported Nivto company profile file.");
        }
        companyFieldIds.forEach(function (id) {
            const value = profileFile.profile[id];
            if (value !== undefined && typeof value !== "string" && typeof value !== "number") {
                throw new Error("The company profile contains an invalid value.");
            }
        });
        applyCompanyProfile(Object.fromEntries(companyFieldIds.map(function (id) {
            const value = profileFile.profile[id];
            return [id, value === undefined ? "" : String(value)];
        })));
        saveCompanyProfile();
        showMessage("Company profile loaded and saved in this browser.");
    }).catch(function (error) {
        showMessage(error.message || "Could not read this company profile file.", true);
    });
}

function refreshSuggestions(kind) {
    const list = document.getElementById(kind + "Suggestions");
    if (!list) return;

    const selectedTypes = Array.from(document.querySelectorAll('input[name="businessTypeOption"]:checked'))
        .map(option => option.value);
    const defaults = selectedTypes.flatMap(function (businessType) {
        return (businessSuggestionDefaults[businessType] || businessSuggestionDefaults.general)[kind];
    });
    const stored = savedSuggestions()[kind];
    const saved = Array.isArray(stored) ? stored.filter(value => typeof value === "string") : [];
    const unique = new Map();
    defaults.concat(saved).forEach(function (name) {
        const cleanName = name.trim();
        if (cleanName) unique.set(cleanName.toLocaleLowerCase(), cleanName);
    });

    list.replaceChildren();
    unique.forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        list.appendChild(option);
    });
}

function rememberSuggestion(kind, value) {
    const name = value.trim();
    if (!name || !suggestionDefaults[kind]) return;

    try {
        const saved = savedSuggestions();
        const entries = Array.isArray(saved[kind]) ? saved[kind] : [];
        if (!entries.some(entry => typeof entry === "string" && entry.trim().toLocaleLowerCase() === name.toLocaleLowerCase())) {
            entries.push(name);
            saved[kind] = entries;
            localStorage.setItem(suggestionStorageKey, JSON.stringify(saved));
            refreshSuggestions(kind);
        }
    } catch (error) {
        showMessage("This browser could not save the custom list. The item is still available for this quotation.", true);
    }
}

Object.keys(suggestionDefaults).forEach(function (kind) {
    setUpSuggestions(kind + "Suggestions", []);
    refreshSuggestions(kind);
});
loadCompanyProfile();
Object.keys(rowContainers).forEach(refreshSuggestions);

function syncBusinessTypeChecks() {
    const field = document.getElementById("businessType");
    const validTypes = Object.keys(businessSuggestionDefaults);
    const savedTypes = field.value.split(",").filter(type => validTypes.includes(type));
    const selectedTypes = savedTypes.includes("general") || savedTypes.length === 0
        ? ["general"]
        : savedTypes;

    document.querySelectorAll('input[name="businessTypeOption"]').forEach(function (option) {
        option.checked = selectedTypes.includes(option.value);
    });
    field.value = selectedTypes.join(",");
}

document.getElementById("businessTypeOptions").addEventListener("change", function (event) {
    const changedOption = event.target.closest('input[name="businessTypeOption"]');
    if (!changedOption) return;

    const options = Array.from(document.querySelectorAll('input[name="businessTypeOption"]'));
    if (changedOption.value === "general" && changedOption.checked) {
        options.filter(option => option !== changedOption).forEach(option => option.checked = false);
    } else if (changedOption.value !== "general" && changedOption.checked) {
        document.querySelector('input[name="businessTypeOption"][value="general"]').checked = false;
    }

    if (!options.some(option => option.checked)) {
        document.querySelector('input[name="businessTypeOption"][value="general"]').checked = true;
    }

    document.getElementById("businessType").value = options
        .filter(option => option.checked)
        .map(option => option.value)
        .join(",");
    Object.keys(rowContainers).forEach(refreshSuggestions);
    saveCompanyProfile();
});

form.addEventListener("input", function (event) {
    if (companyFieldIds.includes(event.target.id)) saveCompanyProfile();
});

form.addEventListener("change", function (event) {
    const description = event.target.closest(".line-description");
    if (!description) return;

    const kind = description.closest("[data-kind]").dataset.kind;
    rememberSuggestion(kind, description.value);
});

Object.keys(rowContainers).forEach(function (kind) {
    addLineItem(kind);
});

const newQuoteButton = document.getElementById("newQuoteButton");
if (newQuoteButton) {
    newQuoteButton.addEventListener("click", function () {
        const companyProfile = readCompanyProfile();
        form.reset();
        applyCompanyProfile(companyProfile);
        Object.keys(rowContainers).forEach(function (kind) {
            rowContainers[kind].replaceChildren();
            addLineItem(kind);
        });
        importedQuoteDate = null;
        lastCalculation = null;
        if (results) results.hidden = true;
        const message = document.getElementById("calculatorMessage");
        if (message) message.remove();
        currencySelect.dispatchEvent(new Event("change", { bubbles: true }));
        document.getElementById("jobReference").focus();
    });
}

const resetAllButton = document.getElementById("resetAllButton");
if (resetAllButton) {
    resetAllButton.addEventListener("click", function () {
        const confirmed = window.confirm("Reset all company details, quote data, line items, and saved custom dropdown suggestions? This cannot be undone.");
        if (!confirmed) return;

        localStorage.removeItem(companyStorageKey);
        localStorage.removeItem(suggestionStorageKey);
        form.reset();
        Object.keys(rowContainers).forEach(function (kind) {
            rowContainers[kind].replaceChildren();
            addLineItem(kind);
        });
        Object.keys(rowContainers).forEach(refreshSuggestions);
        importedQuoteDate = null;
        lastCalculation = null;
        if (results) results.hidden = true;
        const message = document.getElementById("calculatorMessage");
        if (message) message.remove();
        currencySelect.dispatchEvent(new Event("change", { bubbles: true }));
        document.getElementById("businessType").focus();
    });
}

const saveCompanyProfileButton = document.getElementById("saveCompanyProfileButton");
if (saveCompanyProfileButton) {
    saveCompanyProfileButton.addEventListener("click", saveCompanyProfileFile);
}

const loadCompanyProfileButton = document.getElementById("loadCompanyProfileButton");
const companyProfileFileInput = document.getElementById("companyProfileFileInput");
if (loadCompanyProfileButton && companyProfileFileInput) {
    loadCompanyProfileButton.addEventListener("click", function () {
        companyProfileFileInput.click();
    });
    companyProfileFileInput.addEventListener("change", function () {
        loadCompanyProfileFile(companyProfileFileInput.files[0]);
        companyProfileFileInput.value = "";
    });
}

if (currencySelect) {
    currencySelect.addEventListener("change", function (event) {
        if (event.isTrusted) importedQuoteDate = null;
        form.querySelectorAll(".line-item-row").forEach(function (row) {
            const kind = row.closest("[data-kind]").dataset.kind;
            const caption = row.querySelector(".line-rate-caption");
            caption.textContent = kind === "labour"
                ? "Rate per hour (" + currency() + ")"
                : "Price per unit (" + currency() + ")";
        });
        form.querySelectorAll(".line-item-row").forEach(updateLineTotal);
        if (lastCalculation) {
            calculate();
        }
    });
}

const saveQuoteButton = document.getElementById("saveQuoteButton");
if (saveQuoteButton) {
    saveQuoteButton.addEventListener("click", saveQuoteFile);
}

const openQuoteButton = document.getElementById("openQuoteButton");
const quoteFileInput = document.getElementById("quoteFileInput");
if (openQuoteButton && quoteFileInput) {
    openQuoteButton.addEventListener("click", function () {
        quoteFileInput.click();
    });
    quoteFileInput.addEventListener("change", function () {
        loadQuoteFile(quoteFileInput.files[0]);
        quoteFileInput.value = "";
    });
}

const createInvoiceButton = document.getElementById("createInvoiceButton");
if (createInvoiceButton) {
    createInvoiceButton.addEventListener("click", createInvoice);
}

const downloadButton =
    document.getElementById("downloadReport") ||
    document.getElementById("downloadButton") ||
    document.getElementById("downloadEstimate");

if (downloadButton) {
    downloadButton.addEventListener("click", function (event) {
        event.preventDefault();
        downloadReport();
    });
}

const printButton =
    document.getElementById("printReport") ||
    document.getElementById("printButton") ||
    document.getElementById("printEstimate");

if (printButton) {
    printButton.addEventListener("click", function (event) {
        event.preventDefault();
        printReport();
    });
}

if (results) {
    results.hidden = true;
}

console.log("Nivto Fabrication calculator loaded successfully.");

});
