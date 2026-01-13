package com.silkroute_erp.sales.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "finances")
public class Finances {
    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "VARCHAR(36")
    private UUID id;
    @Column(name = "total_budget")
    private double totalbudget;
    @Column(name = "cash_inflow")
    private double cashInflow;
    @Column(name = "cash_outflow")
    private double cashOutflow;
    @Column(name = "total_income")
    private double totalIncome;
    @Column(name = "total_outcome")
    private double outcome;

    public Finances(double totalbudget, double cashInflow, double cashOutflow, double totalIncome, double outcome) {
        this.totalbudget = totalbudget;
        this.cashInflow = cashInflow;
        this.cashOutflow = cashOutflow;
        this.totalIncome = totalIncome;
        this.outcome = outcome;
    }

    public Finances() {

    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public double getTotalbudget() {
        return totalbudget;
    }

    public void setTotalbudget(double totalbudget) {
        this.totalbudget = totalbudget;
    }

    public double getCashInflow() {
        return cashInflow;
    }

    public void setCashInflow(double cashInflow) {
        this.cashInflow = cashInflow;
    }

    public double getCashOutflow() {
        return cashOutflow;
    }

    public void setCashOutflow(double cashOutflow) {
        this.cashOutflow = cashOutflow;
    }

    public double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public double getOutcome() {
        return outcome;
    }

    public void setOutcome(double outcome) {
        this.outcome = outcome;
    }
}
