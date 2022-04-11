package edu.brynmawr.cmsc353.webapp.models;

import android.content.Context;

import org.parceler.Parcel;

import java.util.ArrayList;
import java.util.List;

@Parcel
public class Hospital {
    String name;
    String phone;
    String address;
    int zip;
    ArrayList<String> insurances;
    int capacity;
    boolean acceptsNew;

    public Hospital(String name, String phone, String address, int zip, int capacity, boolean acceptsNew) {
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.zip = zip;
        this.insurances = new ArrayList<>();
        this.capacity = capacity;
        this.acceptsNew = acceptsNew;
    }

    // empty constructor used by parcel
    public Hospital() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public ArrayList<String> getInsurances() {
        return insurances;
    }

    public void setInsurances(ArrayList<String> insurances) {
        this.insurances = insurances;
    }

    public int getZip() {
        return zip;
    }

    public void setZip(int zip) {
        this.zip = zip;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public boolean isAcceptsNew() {
        return acceptsNew;
    }

    public void setAcceptsNew(boolean acceptsNew) {
        this.acceptsNew = acceptsNew;
    }

    public static List<Hospital> getHospitals(Context context, List<String[]> hospitalData) {
        List<Hospital> hospitals = new ArrayList<>();
        for (int i = 0; i < hospitalData.size(); i++) {
            System.out.println(hospitalData.get(i)[2]);
            boolean acceptsNew;
            if (hospitalData.get(i)[5].equals("T")){
                acceptsNew = true;
            }
            else{
                acceptsNew = false;
            }
            // populating hospitals list
            hospitals.add(new Hospital(hospitalData.get(i)[0], hospitalData.get(i)[1],
                    hospitalData.get(i)[2], Integer.parseInt(hospitalData.get(i)[3]),
                    Integer.parseInt(hospitalData.get(i)[4]), acceptsNew));
        }
        return hospitals;
    }
}
