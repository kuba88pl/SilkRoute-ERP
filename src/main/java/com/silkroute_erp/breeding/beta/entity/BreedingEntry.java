package com.silkroute_erp.breeding.beta.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "breeding_entries")
public class BreedingEntry {

    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)")
    private UUID id;

    /* Powiązanie z samicą rozrodową */
    @ManyToOne
    @JoinColumn(name = "breeding_spider_id", nullable = false)
    @JsonIgnore
    private BreedingSpider breedingSpider;

    /* ============================
       KOPULACJE (max 4)
    ============================ */

    @Column(name = "pairing_date_1")
    private LocalDate pairingDate1;

    @Column(name = "pairing_date_2")
    private LocalDate pairingDate2;

    @Column(name = "pairing_date_3")
    private LocalDate pairingDate3;

    @Column(name = "pairing_date_4")
    private LocalDate pairingDate4;

    @Column(name = "pairing_temperature")
    private Double pairingTemperature;

    @Column(name = "pairing_humidity")
    private Double pairingHumidity;

    @Column(name = "pairing_notes", columnDefinition = "TEXT")
    private String pairingNotes;

    /* ============================
       KOKON
    ============================ */

    @OneToOne(mappedBy = "entry", cascade = CascadeType.ALL)
    private EggSack eggSack;

    @Column(name = "sac_date")
    private LocalDate sacDate;

    @Column(name = "recommended_pull_date")
    private LocalDate recommendedPullDate;

    /* ============================
       WYNIK KOKONU
    ============================ */

    @Column(name = "total_eggs_or_nymphs")
    private Integer totalEggsOrNymphs;

    @Column(name = "dead_count")
    private Integer deadCount;

    @Column(name = "live_l1_count")
    private Integer liveL1Count;

    @Enumerated(EnumType.STRING)
    @Column(name = "cocoon_status")
    private CocoonStatus cocoonStatus;

    /* ============================
       NOTATKI BEHAWIORALNE (TERAZ JEDNO POLE)
    ============================ */

    @Column(name = "behavior_notes", columnDefinition = "TEXT")
    private String behaviorNotes;

    /* ============================
       NOTATKI OGÓLNE
    ============================ */

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /* ============================
       SYSTEMOWE
    ============================ */

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "updated_at")
    private LocalDate updatedAt;

    /* ============================
       ENUM STATUSU KOKONU
    ============================ */

    public enum CocoonStatus {
        HEALTHY,
        DRIED_OUT,
        ROTTEN,
        INFERTILE,
        EATEN
    }

    /* ============================
       GETTERY / SETTERY
    ============================ */

    public BreedingEntry() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BreedingSpider getBreedingSpider() {
        return breedingSpider;
    }

    public void setBreedingSpider(BreedingSpider breedingSpider) {
        this.breedingSpider = breedingSpider;
    }

    public LocalDate getPairingDate1() {
        return pairingDate1;
    }

    public void setPairingDate1(LocalDate pairingDate1) {
        this.pairingDate1 = pairingDate1;
    }

    public LocalDate getPairingDate2() {
        return pairingDate2;
    }

    public void setPairingDate2(LocalDate pairingDate2) {
        this.pairingDate2 = pairingDate2;
    }

    public LocalDate getPairingDate3() {
        return pairingDate3;
    }

    public void setPairingDate3(LocalDate pairingDate3) {
        this.pairingDate3 = pairingDate3;
    }

    public LocalDate getPairingDate4() {
        return pairingDate4;
    }

    public void setPairingDate4(LocalDate pairingDate4) {
        this.pairingDate4 = pairingDate4;
    }

    public Double getPairingTemperature() {
        return pairingTemperature;
    }

    public void setPairingTemperature(Double pairingTemperature) {
        this.pairingTemperature = pairingTemperature;
    }

    public Double getPairingHumidity() {
        return pairingHumidity;
    }

    public void setPairingHumidity(Double pairingHumidity) {
        this.pairingHumidity = pairingHumidity;
    }

    public String getPairingNotes() {
        return pairingNotes;
    }

    public void setPairingNotes(String pairingNotes) {
        this.pairingNotes = pairingNotes;
    }

    public LocalDate getSacDate() {
        return sacDate;
    }

    public void setSacDate(LocalDate sacDate) {
        this.sacDate = sacDate;
    }

    public EggSack getEggSack() {
        return eggSack;
    }

    public void setEggSack(EggSack eggSack) {
        this.eggSack = eggSack;
    }

    public LocalDate getRecommendedPullDate() {
        return recommendedPullDate;
    }

    public void setRecommendedPullDate(LocalDate recommendedPullDate) {
        this.recommendedPullDate = recommendedPullDate;
    }

    public Integer getTotalEggsOrNymphs() {
        return totalEggsOrNymphs;
    }

    public void setTotalEggsOrNymphs(Integer totalEggsOrNymphs) {
        this.totalEggsOrNymphs = totalEggsOrNymphs;
    }

    public Integer getDeadCount() {
        return deadCount;
    }

    public void setDeadCount(Integer deadCount) {
        this.deadCount = deadCount;
    }

    public Integer getLiveL1Count() {
        return liveL1Count;
    }

    public void setLiveL1Count(Integer liveL1Count) {
        this.liveL1Count = liveL1Count;
    }

    public CocoonStatus getCocoonStatus() {
        return cocoonStatus;
    }

    public void setCocoonStatus(CocoonStatus cocoonStatus) {
        this.cocoonStatus = cocoonStatus;
    }

    public String getBehaviorNotes() {
        return behaviorNotes;
    }

    public void setBehaviorNotes(String behaviorNotes) {
        this.behaviorNotes = behaviorNotes;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDate getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }
}
