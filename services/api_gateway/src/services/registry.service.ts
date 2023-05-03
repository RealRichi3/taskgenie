import fs from 'fs'
import { APIService } from '../types'
import reg from  '../registry.json'
const registry = reg as APIService<false>[]

async function addServiceToRegistry (service: APIService) {
    const service_exists = registry.servicesp[]
    // Check if servie is already registered
    // If not, add it to the registry
    // If it is, update it
    // If not, create it
    // If it does, read it
    // If it is empty, add the service
    // If it is not empty, check if the service is already registered


}

async function removeServiceToRegistry () {}

async function getServicesFromRegistry () {}

async function getServiceFromRegistry () {}

async function checkIfServiceIsRegistered () {}

export {
    addServiceToRegistry,
    removeServiceToRegistry,
    getServicesFromRegistry,
    getServiceFromRegistry,
    checkIfServiceIsRegistered
}

export default {
    addServiceToRegistry,
    removeServiceToRegistry,
    getServicesFromRegistry,
    getServiceFromRegistry,
    checkIfServiceIsRegistered
}

