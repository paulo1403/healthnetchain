const categories = {
    "Información del paciente": "Patient",
    "Datos del contacto": "contact",
    "Alergias e Intolerancias": "AllergyIntolerance",
    "Reacción": "reaction",
    "Medicación": "Medication"
}

const subCategories = {
    "Datos del contacto": "contact",
    "Reacción": "reaction",
}

const patientToData = {
    "Nombre": "name",
    "DNI": "dni",
    "Género": "gender",
    "Fecha de Nacimiento": "birthDate",
    "Dirección": "address",
    "Estado Civil": "maritalStatus",
    "Nombre Familiar": "contactName",
    "Parentesco": "contactRelationship",
} 

const contactToData = {
    "Parentesco": "relationship",
    "Nombre": "name",
    "Teléfono": "phoneNumber",
    "Correo": "email",
}

const alergiesToData = {
    "Tipo": "type",
    "Categoría": "category",
    "Cri�cidad": "criticality",
    "Estado de verificación": "verificationStatus",
    "Úl�ma ocurrencia": "lastOccurrence",
    "Par�cipante": "participant",
}

const reactionToData = {
    "Sustancia": "sustance",
    "Descripción": "description",
    "Gravedad": "severity",
}

const medicationToData = {
    "Nombre": "name",
    "Código": "code",
    "Volumen total": "totalVolume",
    "Forma de dosis": "doseForm",
}

module.exports = {
    categories,
    subCategories,
    patientToData,
    contactToData,
    alergiesToData,
    reactionToData,
    medicationToData
}