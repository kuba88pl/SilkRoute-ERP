package com.silkroute_erp.sales.dto;

import java.util.UUID;

public class CustomerDTO {

    private UUID id;
    private String firstName;
    private String lastName;
    private String telephone;
    private String email;
    private String address;
    private String parcelLocker;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getParcelLocker() { return parcelLocker; }
    public void setParcelLocker(String parcelLocker) { this.parcelLocker = parcelLocker; }
}
